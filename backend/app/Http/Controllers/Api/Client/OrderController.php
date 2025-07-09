<?php

namespace App\Http\Controllers\Api\Client;

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
use App\Traits\ApiResponseTrait;
use App\Models\Size;
use App\Models\Color;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Cart;

class OrderController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lấy danh sách đơn hàng của user hiện tại
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }

        $query = Order::where('user_id', $user->id)
            ->with(['customer', 'shipping', 'orderItems.product', 'orderItems.variant.size', 'orderItems.variant.color']);

        // Lọc theo trạng thái
        if ($request->has('status')) {
            $query->where('order_status', $request->input('status'));
        }

        // Lọc theo ngày
        if ($request->has('date')) {
            $date = Carbon::parse($request->input('date'))->format('Y-m-d');
            $query->whereDate('created_at', $date);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        return $this->successResponse($orders, 'Lấy danh sách đơn hàng thành công');
    }

    /**
     * Tạo đơn hàng mới
     */

    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction();

        try {
            // Lấy giỏ hàng
            $cart = Cart::with('items')->where('user_id', $request->user()->id)->first();

            if (!$cart || $cart->items->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Giỏ hàng trống hoặc không tồn tại',
                ], 400);
            }

            $totalPrice = 0;

            // Lấy danh sách sản phẩm để tra giá
            $productIds = $cart->items->pluck('product_id')->toArray();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            // Tạo đơn hàng
            $order = Order::create([
                'date_order'        => now(),
                'total_price'       => 0, // cập nhật lại sau
                'order_status'      => 'pending',
                'payment_status'    => 'unpaid',
                'shipping_address'  => $request->shipping_address,
                'payment_method'    => $request->payment_method,
                'user_id'           => $request->user()->id,
                'shipping_id'       => $request->shipping_id ?? 1,
                'recipient_name'    => $request->recipient_name,
                'recipient_phone'   => $request->recipient_phone,
                'recipient_email'   => $request->recipient_email,
            ]);

            foreach ($cart->items as $item) {
                $product = $products[$item->product_id] ?? null;

                if (!$product) {
                    throw new \Exception("Không tìm thấy sản phẩm với ID {$item->product_id}");
                }

                $price = $product->price;
                $lineTotal = $price * $item->quantity;
                $totalPrice += $lineTotal;

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $price,
                    'variant_id' => $item->variant_id,
                ]);
            }

            // Cập nhật lại tổng tiền đơn hàng
            $order->update(['total_price' => $totalPrice]);

            // Xoá giỏ hàng sau khi đặt
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Tạo đơn hàng thành công từ giỏ hàng',
                'data' => $order->load('orderItems'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi tạo đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Xem chi tiết đơn hàng của user
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with([
                'customer',
                'shipping',
                'user',
                'voucher',
                'orderItems.product',
                'orderItems.variant.size',
                'orderItems.variant.color',
            ])->first();
        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại hoặc bạn không có quyền truy cập', null, 404);
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

    /**
     * Hủy đơn hàng (chỉ cho phép ở trạng thái pending/confirming)
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại hoặc bạn không có quyền hủy', null, 404);
        }
        if (!in_array($order->order_status, ['pending', 'confirming'])) {
            return $this->errorResponse('Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận hoặc đang xác nhận', null, 400);
        }
        $request->validate([
            'cancel_reason' => 'required|string|max:500',
        ], [
            'cancel_reason.required' => 'Lý do hủy đơn hàng là bắt buộc',
            'cancel_reason.max' => 'Lý do hủy đơn hàng không được vượt quá 500 ký tự'
        ]);
        try {
            $order->order_status = 'canceled';
            $order->cancel_reason = $request->input('cancel_reason');
            $order->save();
            Log::info('Order canceled by user', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'reason' => $order->cancel_reason
            ]);
            return $this->successResponse($order, 'Hủy đơn hàng thành công');
        } catch (\Exception $e) {
            Log::error('Failed to cancel order', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
                'user_id' => $user->id
            ]);
            return $this->errorResponse('Hủy đơn hàng thất bại: ' . $e->getMessage(), null, 500);
        }
    }
}
