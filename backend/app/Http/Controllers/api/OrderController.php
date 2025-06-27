<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\VariantProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use App\Traits\ApiResponseTrait;
use App\Models\Size;
use App\Models\Color;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    use ApiResponseTrait;
    private $validTransitions = [
        'pending' => ['confirming', 'canceled'],
        'confirming' => ['confirmed', 'canceled'],
        'confirmed' => ['preparing', 'canceled'],
        'preparing' => ['shipping', 'canceled'],
        'shipping' => ['delivered', 'canceled'],
        'delivered' => ['completed'],
        'completed' => [],
        'canceled' => [],
    ];
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'shipping_id' => 'required|exists:shipping,id',
            'user_id' => 'required|exists:users,id',
            'shipping_address' => 'required|string|max:255',
            'payment_method' => 'required|in:cash,card,paypal,vnpay',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'order_items' => 'required|array',
            'order_items.*.product_id' => 'required|exists:products,id',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.price' => 'required|numeric|min:0',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $total = 0;
        foreach ($request->order_items as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        $discount = 0;
        $voucher = null;
        if ($request->voucher_code) {
            $voucher = Voucher::where('code', $request->voucher_code)
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereNull('expiry_date')
                        ->orWhere('expiry_date', '>=', Carbon::now());
                })
                ->first();

            if ($voucher) {
                $applicable_total = 0;
                foreach ($request->order_items as $item) {
                    $product = Product::find($item['product_id']);
                    if (
                        ($voucher->product_id && $voucher->product_id == $product->id) ||
                        ($voucher->category_id && $product->category_id == $voucher->category_id) ||
                        (!$voucher->product_id && !$voucher->category_id)
                    ) {
                        $applicable_total += $item['price'] * $item['quantity'];
                    }
                }

                if ($applicable_total > 0) {
                    $discount = $voucher->discount_type === 'percentage'
                        ? $applicable_total * ($voucher->discount / 100)
                        : min($voucher->discount, $applicable_total);
                } else {
                    return response()->json(['message' => 'Voucher not applicable to any items in cart'], 400);
                }
            } else {
                return response()->json(['message' => 'Invalid or expired voucher'], 400);
            }
        }

        try {
            DB::beginTransaction();

            // Tạo đơn hàng
            $order = Order::create([
                'slug' => Str::slug('order-' . time()),
                'date_order' => Carbon::now(),
                'total_price' => $total - $discount,
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
                'shipped_at' => null,
                'delivered_at' => null,
                'user_id' => $request->user_id,
                'customer_id' => $request->customer_id,
                'shipping_id' => $request->shipping_id,
                'recipient_name' => $request->recipient_name,
                'recipient_phone' => $request->recipient_phone,
                'voucher_id' => $voucher ? $voucher->id : null,
            ]);

            foreach ($request->order_items as $item) {
                $variant = VariantProduct::find($item['variant_id'] ?? null);
                if ($variant && $variant->quantity < $item['quantity']) {
                    throw new \Exception('Insufficient stock for product ID ' . $item['product_id']);
                }
            }

            foreach ($request->order_items as $item) {
                $orderItem = $order->orderItems()->create([
                    'slug' => Str::slug('item-' . time() . '-' . $item['product_id']),
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'variant_id' => $item['variant_id'] ?? null,
                ]);

                if ($item['variant_id']) {
                    $variant = VariantProduct::find($item['variant_id']);
                    $variant->quantity -= $item['quantity'];
                    $variant->save();
                }
            }

            if ($voucher) {
                VoucherUser::where('voucher_id', $voucher->id)
                    ->where('user_id', $request->user_id)
                    ->whereNull('order_id')
                    ->update(['order_id' => $order->id]);

                if ($voucher->usage_limit && $voucher->usage_count >= $voucher->usage_limit) {
                    throw new \Exception('Voucher usage limit exceeded');
                }
                $voucher->increment('usage_count');
            }

            DB::commit();
            Log::info('Order created successfully', ['order_id' => $order->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create order', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create order: ' . $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'data' => $order->load(['customer', 'shipping', 'user', 'orderItems.product', 'voucher']),
        ], 201);
    }
    public function index(Request $request)
    {
        $query = Order::query()->with(['customer', 'shipping', 'user']);

        if ($request->has('date')) {
            $date = Carbon::parse($request->input('date'))->format('Y-m-d');
            $query->whereDate('date_order', $date);
        }

        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('date_order', $request->input('month'))
                ->whereYear('date_order', $request->input('year'));
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date_order', [
                Carbon::parse($request->input('start_date'))->startOfDay(),
                Carbon::parse($request->input('end_date'))->endOfDay()
            ]);
        }

        $orders = $query->paginate(10);

        return response()->json($orders, 200);
    }

    public function show($id)
    {
        $order = Order::with([
            'customer',
            'shipping',
            'user',
            'voucher',
            'orderItems.product',
            'orderItems.variant.size',
            'orderItems.variant.color',
        ])->find($id);

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        $result = [
            'id' => $order->id,
            'date_order' => $order->created_at,
            'total_price' => $order->total_price,
            'order_status' => $order->order_status,
            'cancel_reason' => $order->cancel_reason,
            'payment_status' => $order->payment_status,
            'shipping_address' => $order->shipping_address,
            'payment_method' => $order->payment_method,
            'shipped_at' => $order->shipped_at,
            'delivered_at' => $order->delivered_at,
            'user_id' => $order->user_id,
            'customer_id' => $order->customer_id,
            'shipping_id' => $order->shipping_id,
            'recipient_name' => $order->recipient_name,
            'recipient_phone' => $order->recipient_phone,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'voucher' => $order->voucher, 
            'items' => $order->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'slug' => $item->product->slug,
                        'category_id' => $item->product->category_id,
                        'name' => $item->product->name,
                        'description' => $item->product->description,
                        'price' => $item->product->price,
                        'sale_price' => $item->product->sale_price,
                        'sale_end' => $item->product->sale_end,
                        'status' => $item->product->status,
                        'deleted_at' => $item->product->deleted_at,
                        'created_at' => $item->product->created_at,
                        'updated_at' => $item->product->updated_at,
                    ],
                    'variant' => $item->variant ? [
                        'id' => $item->variant->id,
                        'size' => [
                            'name' => optional($item->variant->size)->name,
                        ],
                        'color' => [
                            'name' => optional($item->variant->color)->name,
                        ],
                        'status' => $item->variant->status,
                    ] : null,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ];
            }),
        ];

        return $this->successResponse($result, 'Lấy thông tin đơn hàng thành công');
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'order_status' => 'required|in:confirming,confirmed,preparing,shipping,delivered,completed,canceled,pending',
            'payment_status' => 'nullable|in:unpaid,paid',
            'cancel_reason' => 'required_if:order_status,canceled|string|max:255',
        ]);

        $currentStatus = $order->order_status;
        $newStatus = $request->input('order_status');
        if (!in_array($newStatus, $this->validTransitions[$currentStatus] ?? [])) {
            return response()->json(['error' => 'Invalid status transition from ' . $currentStatus . ' to ' . $newStatus], 400);
        }

        $order->order_status = $newStatus;
        if ($request->has('payment_status')) {
            if ($newStatus === 'canceled' && $request->input('payment_status') === 'paid') {
                return response()->json(['error' => 'Cannot set payment_status to paid for a canceled order'], 400);
            }
            $order->payment_status = $request->input('payment_status');
        }
        if ($newStatus === 'canceled') {
            $order->cancel_reason = $request->input('cancel_reason');
        } else {
            $order->cancel_reason = null;
        }

        if ($newStatus === 'shipping' && !$order->shipped_at) {
            $order->shipped_at = Carbon::now();
        } elseif ($newStatus === 'delivered' && !$order->delivered_at) {
            $order->delivered_at = Carbon::now();
        }

        try {
            $order->save();
            Log::info('Order status updated', ['order_id' => $id, 'new_status' => $newStatus]);
        } catch (\Exception $e) {
            Log::error('Failed to update order status', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update order: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load(['customer', 'shipping', 'user'])
        ], 200);
    }

    public function searchByProduct(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
        ]);

        $productName = $request->input('product_name');

        $query = Order::whereHas('orderItems.product', function ($query) use ($productName) {
            $query->where('name', 'like', '%' . $productName . '%');
        })->with(['customer', 'shipping', 'user', 'orderItems.product']);

        $orders = $query->paginate(10);

        return response()->json($orders, 200);
    }

    public function generatePDF($id)
    {
        $order = Order::with(['customer', 'shipping', 'user', 'orderItems.product', 'orderItems.variant'])
            ->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $data = [
            'order' => $order,
            'title' => 'Hóa Đơn #' . $order->id,
            'date' => Carbon::now()->format('Y-m-d H:i:s')
        ];

        try {
            $pdf = Pdf::loadView('pdf.invoice', $data);
            return $pdf->download('invoice_' . $order->id . '.pdf');
        } catch (\Exception $e) {
            Log::error('Failed to generate PDF', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }
    }
}