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
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:variant_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'recipient_name' => 'required|string',
            'recipient_phone' => 'required|string',
            'payment_method' => 'required|in:cash,cod,online',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Dữ liệu không hợp lệ', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            // Tính tổng tiền và kiểm tra tồn kho
            $totalPrice = 0;
            $orderItems = [];

            foreach ($request->input('items') as $item) {
                $product = Product::find($item['product_id']);
                if (!$product || $product->status !== 'active') {
                    throw new \Exception('Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa');
                }

                $variant = null;
                if (isset($item['variant_id'])) {
                    $variant = VariantProduct::find($item['variant_id']);
                    if (!$variant || $variant->product_id !== $product->id) {
                        throw new \Exception('Biến thể sản phẩm không hợp lệ');
                    }
                }

                // Kiểm tra tồn kho
                $availableStock = $variant ? $variant->stock : $product->stock;
                if ($availableStock < $item['quantity']) {
                    throw new \Exception("Sản phẩm {$product->name} không đủ tồn kho");
                }

                $itemPrice = $variant
                    ? $variant->price
                    : ($product->sale_price ?? $product->price);
                $totalPrice += $itemPrice * $item['quantity'];

                $orderItems[] = [
                    'product_id' => $product->id,
                    'variant_id' => $variant ? $variant->id : null,
                    'quantity' => $item['quantity'],
                    'price' => $itemPrice,
                ];
            }

            // Xử lý voucher
            $discountAmount = 0;
            $voucher = null;
            if ($request->has('voucher_code')) {
                $voucher = Voucher::where('code', $request->input('voucher_code'))
                    ->where('status', 'active')
                    ->where('start_date', '<=', Carbon::now())
                    ->where('end_date', '>=', Carbon::now())
                    ->first();

                if ($voucher) {
                    // Kiểm tra xem user đã sử dụng voucher này chưa
                    $usedVoucher = VoucherUser::where('user_id', $user->id)
                        ->where('voucher_id', $voucher->id)
                        ->first();

                    if (!$usedVoucher) {
                        if ($voucher->type === 'percentage') {
                            $discountAmount = ($totalPrice * $voucher->value) / 100;
                        } else {
                            $discountAmount = $voucher->value;
                        }
                        
                        // Giới hạn số tiền giảm tối đa
                        if ($voucher->max_discount && $discountAmount > $voucher->max_discount) {
                            $discountAmount = $voucher->max_discount;
                        }
                    }
                }
            }

            $finalTotal = $totalPrice - $discountAmount;

            // Tạo đơn hàng
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $finalTotal,
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'shipping_address' => $request->input('shipping_address'),
                'payment_method' => $request->input('payment_method'),
                'recipient_name' => $request->input('recipient_name'),
                'recipient_phone' => $request->input('recipient_phone'),
                'voucher_id' => $voucher ? $voucher->id : null,
                'discount_amount' => $discountAmount,
            ]);

            // Tạo order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                // Cập nhật tồn kho
                if ($item['variant_id']) {
                    $variant = VariantProduct::find($item['variant_id']);
                    $variant->decrement('stock', $item['quantity']);
                } else {
                    $product = Product::find($item['product_id']);
                    $product->decrement('stock', $item['quantity']);
                }
            }

            // Đánh dấu voucher đã sử dụng
            if ($voucher) {
                VoucherUser::create([
                    'user_id' => $user->id,
                    'voucher_id' => $voucher->id,
                    'used_at' => Carbon::now(),
                ]);
            }

            DB::commit();

            $order->load(['orderItems.product', 'orderItems.variant.size', 'orderItems.variant.color', 'voucher']);

            return $this->successResponse($order, 'Tạo đơn hàng thành công');

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to create order', ['error' => $e->getMessage()]);
            return $this->errorResponse('Tạo đơn hàng thất bại: ' . $e->getMessage(), null, 500);
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
     * Hủy đơn hàng
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }

        $validator = Validator::make($request->all(), [
            'cancel_reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Dữ liệu không hợp lệ', $validator->errors(), 422);
        }

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirming
        if (!in_array($order->order_status, ['pending', 'confirming'])) {
            return $this->errorResponse('Không thể hủy đơn hàng ở trạng thái này', null, 400);
        }

        DB::beginTransaction();
        try {
            $order->order_status = 'canceled';
            $order->cancel_reason = $request->input('cancel_reason');
            $order->save();

            // Hoàn trả tồn kho
            foreach ($order->orderItems as $item) {
                if ($item->variant_id) {
                    $variant = VariantProduct::find($item->variant_id);
                    $variant->increment('stock', $item->quantity);
                } else {
                    $product = Product::find($item->product_id);
                    $product->increment('stock', $item->quantity);
                }
            }

            // Hoàn trả voucher nếu có
            if ($order->voucher_id) {
                VoucherUser::where('user_id', $user->id)
                    ->where('voucher_id', $order->voucher_id)
                    ->delete();
            }

            DB::commit();

            return $this->successResponse($order, 'Hủy đơn hàng thành công');

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to cancel order', ['error' => $e->getMessage()]);
            return $this->errorResponse('Hủy đơn hàng thất bại: ' . $e->getMessage(), null, 500);
        }
    }
} 