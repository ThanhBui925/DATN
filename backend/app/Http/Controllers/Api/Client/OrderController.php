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
        $user = $request->user();

        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }

        DB::beginTransaction();
        try {
            // Tính tổng tiền và kiểm tra tồn kho
            $totalPrice = 0;
            $orderItems = [];

            foreach ($request->input('items') as $item) {
                $product = Product::find($item['product_id']);
                if (!$product || (int)$product->status !== 1) {
                    throw new \Exception('Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa');
                }

                $variant = null;
                if (isset($item['variant_id'])) {
                    $variant = VariantProduct::find($item['variant_id']);
                    if (!$variant || $variant->product_id !== $product->id) {
                        throw new \Exception('Biến thể sản phẩm không hợp lệ');
                    }
                    if ($variant->status !== 'active' && $variant->status != 1) {
                        throw new \Exception('Biến thể sản phẩm đã bị vô hiệu hóa');
                    }
                    // Kiểm tra tồn kho đúng trường quantity
                    if ($variant->quantity < $item['quantity']) {
                        throw new \Exception("Sản phẩm {$variant->name} không đủ tồn kho");
                    }
                }

                // Kiểm tra tồn kho
                $availableStock = $variant ? $variant->quantity : null; // Không kiểm tra tồn kho cho product nếu không có trường quantity
                if ($availableStock < $item['quantity']) {
                    throw new \Exception("Sản phẩm {$product->name} không đủ tồn kho");
                }

                // Lấy giá sản phẩm/biến thể, đảm bảo không null
                if ($variant) {
                    $itemPrice = $variant->price ?? $product->sale_price ?? $product->price;
                } else {
                    $itemPrice = $product->sale_price ?? $product->price;
                }
                if ($itemPrice === null) {
                    throw new \Exception('Không xác định được giá sản phẩm!');
                }
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
                    ->where(function($q){
                        $q->where('status', 1)->orWhere('status', 'active');
                    })
                    ->where('expiry_date', '>=', Carbon::now())
                    ->first();

                if ($voucher) {
                    // Kiểm tra xem user đã sử dụng voucher này chưa
                    $usedVoucher = VoucherUser::where('user_id', $user->id)
                        ->where('voucher_id', $voucher->id)
                        ->first();

                    if (!$usedVoucher) {
                        if ($voucher->discount_type === 'percentage') {
                            $discountAmount = ($totalPrice * $voucher->discount) / 100;
                        } else {
                            $discountAmount = $voucher->discount;
                        }
                        // Nếu có usage_limit, kiểm tra số lần sử dụng
                        if ($voucher->usage_limit && $voucher->usage_count >= $voucher->usage_limit) {
                            $discountAmount = 0;
                        }
                    }
                }
            }

            $finalTotal = $totalPrice - $discountAmount;

            // Tạo đơn hàng
            $order = Order::create([
                'user_id' => $user->id,
                'customer_id' => $user->id, // tạm thời gán user_id nếu chưa có bảng customers riêng
                'shipping_id' => 1, // luôn truyền id hợp lệ hiện có trong bảng shipping
                'total_price' => $finalTotal,
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'shipping_address' => $request->input('shipping_address'),
                'payment_method' => $request->input('payment_method'),
                'recipient_name' => $request->input('recipient_name'),
                'recipient_phone' => $request->input('recipient_phone'),
                'voucher_id' => $voucher ? $voucher->id : null,
                'discount_amount' => $discountAmount,
                'date_order' => now(),
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

                // Cập nhật tồn kho đúng trường quantity cho variant
                if ($item['variant_id']) {
                    $variant = VariantProduct::find($item['variant_id']);
                    $variant->decrement('quantity', $item['quantity']);
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
            Log::error('Failed to create order', [
                'error' => $e->getMessage(),
                'user_id' => $user ? $user->id : null,
                'request' => $request->all()
            ]);
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
