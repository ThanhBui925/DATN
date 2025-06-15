<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\VariantProduct;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class OrderController extends Controller
{
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
            $order->orderItems()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        if ($voucher) {
            VoucherUser::where('voucher_id', $voucher->id)
                ->where('user_id', $request->user_id)
                ->whereNull('order_id')
                ->update(['order_id' => $order->id]);
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

        $orders = $query->get();

        return response()->json($orders, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'shipping_id' => 'required|exists:shipping,id',
            'shipping_address' => 'required|string|max:255',
            'payment_method' => 'required|in:cash,card,paypal,vnpay',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|regex:/^0[0-9]{9}$/',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variant_id' => 'required|exists:variant_products,id',
        ]);

        $slug = 'order-' . time() . '-' . rand(1000, 9999);

        $order = Order::create([
            'slug' => $slug,
            'date_order' => Carbon::now(),
            'total_price' => 0,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_address' => $request->input('shipping_address'),
            'payment_method' => $request->input('payment_method'),
            'user_id' => auth()->user()->id,
            'customer_id' => $request->input('customer_id'),
            'shipping_id' => $request->input('shipping_id'),
            'recipient_name' => $request->input('recipient_name'),
            'recipient_phone' => $request->input('recipient_phone'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $totalPrice = 0;
        foreach ($request->input('items') as $item) {
            $product = Product::findOrFail($item['product_id']);
            $variant = VariantProduct::findOrFail($item['variant_id']);
            
            $price = $product->sale_price && $product->sale_end > Carbon::now() ? $product->sale_price : $product->price;
            
            OrderItem::create([
                'slug' => 'item-' . time() . '-' . rand(1000, 9999),
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $price,
                'variant_id' => $item['variant_id'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            $totalPrice += $price * $item['quantity'];
        }

        $order->total_price = $totalPrice;
        $order->save();

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load(['customer', 'shipping', 'user', 'orderItems.product', 'orderItems.variant'])
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'order_status' => 'required|in:confirming,confirmed,preparing,shipping,delivered,completed,canceled,pending',
            'payment_status' => 'nullable|in:unpaid,paid',
            'cancel_reason' => 'required_if:order_status,canceled|string|max:255',
        ]);

        $order->order_status = $request->input('order_status');
        if ($request->has('payment_status')) {
            $order->payment_status = $request->input('payment_status');
        }
        if ($request->input('order_status') === 'canceled') {
            $order->cancel_reason = $request->input('cancel_reason');
        } else {
            $order->cancel_reason = null;
        }

        if ($request->input('order_status') === 'shipping' && !$order->shipped_at) {
            $order->shipped_at = Carbon::now();
        } elseif ($request->input('order_status') === 'delivered' && !$order->delivered_at) {
            $order->delivered_at = Carbon::now();
        }

        $order->updated_at = Carbon::now();
        $order->save();

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

        $orders = Order::whereHas('orderItems.product', function ($query) use ($productName) {
            $query->where('name', 'like', '%' . $productName . '%');
        })->with(['customer', 'shipping', 'user', 'orderItems.product'])->get();

        return response()->json($orders, 200);
    }

    public function showDetail($id)
    {
        $order = Order::with(['customer', 'shipping', 'user', 'orderItems.product', 'orderItems.variant'])
                      ->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json([
            'message' => 'Order details retrieved successfully',
            'order' => $order
        ], 200);
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

        $pdf = Pdf::loadView('pdf.invoice', $data);

        return $pdf->download('invoice_' . $order->id . '.pdf');
    }
}
