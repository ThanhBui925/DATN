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
use App\Http\Requests\UpdateOrderStatusRequest;

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

    /**
     * Lấy danh sách tất cả đơn hàng (Admin)
     */
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

        // Lọc theo trạng thái
        if ($request->has('status')) {
            $query->where('order_status', $request->input('status'));
        }

        // Lọc theo user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return $this->successResponse($orders, 'Lấy danh sách đơn hàng thành công');
    }

    /**
     * Xem chi tiết đơn hàng (Admin)
     */
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
            'discount_amount' => $order->discount_amount,
            'user' => $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ] : null,
            'customer_id' => $order->customer_id,
            'shipping_id' => $order->shipping_id,
            'recipient_name' => $order->recipient_name,
            'recipient_phone' => $order->recipient_phone,
            'recipient_email' => $order->recipient_email,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'voucher' => $order->voucher, 
            'items' => $order->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
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

    /**
     * Cập nhật trạng thái đơn hàng (Admin)
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order = Order::findOrFail($id);

        $currentStatus = $order->order_status;
        $newStatus = $request->input('order_status');

        if (!in_array($newStatus, $this->validTransitions[$currentStatus] ?? [])) {
            return $this->errorResponse(
                'Chuyển trạng thái không hợp lệ từ ' . $currentStatus . ' sang ' . $newStatus,
                null,
                400
            );
        }

        $order->order_status = $newStatus;

        if ($request->has('payment_status')) {
            if ($newStatus === 'canceled' && $request->input('payment_status') === 'paid') {
                return $this->errorResponse('Không thể đặt trạng thái thanh toán là paid cho đơn đã hủy', null, 400);
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
            Log::info('Order status updated', [
                'order_id' => $id,
                'new_status' => $newStatus
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update order status', [
                'error' => $e->getMessage(),
                'order_id' => $id,
                'new_status' => $newStatus
            ]);
            return $this->errorResponse('Cập nhật trạng thái đơn hàng thất bại: ' . $e->getMessage(), null, 500);
        }

        return $this->successResponse($order->load(['customer', 'shipping', 'user']), 'Cập nhật trạng thái đơn hàng thành công');
    }

    /**
     * Tìm kiếm đơn hàng theo sản phẩm (Admin)
     */
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

        return $this->successResponse($orders, 'Tìm kiếm đơn hàng thành công');
    }

    /**
     * Tạo PDF hóa đơn (Admin)
     */
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