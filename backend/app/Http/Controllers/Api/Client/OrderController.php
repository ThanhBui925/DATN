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
use App\Http\Requests\ApplyVoucherRequest;
use App\Http\Requests\UpdateOrderAddressRequest;
use App\Models\Cart;
use App\Models\Address;
use App\Services\ShippingFeeService;
use Illuminate\Support\Facades\Http;



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
            $userId = $request->user()->id;

            $cart = Cart::with('items')->where('user_id', $userId)->first();
            if (!$cart || $cart->items->isEmpty()) {
                return $this->errorResponse('Giỏ hàng trống hoặc không tồn tại.', null, 400);
            }

            if ($request->filled('address_id')) {
                $address = Address::where('id', $request->address_id)
                    ->where('user_id', $userId)
                    ->first();

                if (!$address) {
                    return $this->errorResponse('Địa chỉ không tồn tại hoặc không thuộc về bạn.', null, 404);
                }

                $recipientName = $address->recipient_name;
                $recipientPhone = $address->recipient_phone;
                $recipientEmail = $address->recipient_email;
                $detailed_address = $address->address;
                $wardName = $address->ward_name;
                $districtName = $address->district_name;
                $provinceName = $address->province_name;
                
                $addressId = $address->id;
                $shippingFee = ShippingFeeService::calculate($userId, ['address_id' => $address->id]);
            } else {
                $recipientName = $request->recipient_name;
                $recipientPhone = $request->recipient_phone;
                $recipientEmail = $request->recipient_email;
                $detailed_address = $request->detailed_address;
                $wardName = $request->ward_name;
                $districtName = $request->district_name;
                $provinceName = $request->province_name;
                $addressId = null;
                $shippingFee = ShippingFeeService::calculate($userId, [
                    'province_id' => $request->province_id,
                    'district_id' => $request->district_id,
                    'ward_code'   => $request->ward_code,
                ]);
            }

            $totalPrice = 0;
            $discountAmount = 0;
            $productIds = $cart->items->pluck('product_id')->toArray();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');
           

            $order = Order::create([
                'date_order'        => now(),
                'total_price'       => 0,
                'order_status'      => 'pending',
                'payment_status'    => 'unpaid',
                'address_id'        => $addressId,
                'detailed_address'  => $detailed_address,
                'ward_name'         => $wardName,
                'district_name'     => $districtName,
                'province_name'     => $provinceName,
                'payment_method'    => $request->payment_method,
                'user_id'           => $userId,
                'shipping_id'       => $request->shipping_id ?? 1,
                'recipient_name'    => $recipientName,
                'recipient_phone'   => $recipientPhone,
                'recipient_email'   => $recipientEmail,
                'discount_amount'   => 0,
                'shipping_fee'      => $shippingFee,
                'final_amount'      => 0,

            ]);


            foreach ($cart->items as $item) {
                $product = $products[$item->product_id] ?? null;
                if (!$product) {
                    throw new \Exception("Không tìm thấy sản phẩm với ID {$item->product_id}");
                }

                $price = $product->price;
                $lineTotal = $price * $item->quantity;
                $totalPrice += $lineTotal;

                $variant = VariantProduct::where('id', $item->variant_id)->lockForUpdate()->first();
                if (!$variant || $variant->quantity < $item->quantity) {
                    throw new \Exception("Sản phẩm '{$product->name}' không đủ số lượng tồn kho.");
                }

                $variant->decrement('quantity', $item->quantity);

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $price,
                    'variant_id' => $item->variant_id,
                ]);
            }

            $discountAmount = 0;

            if ($request->filled('voucher_code')) {
                $voucher = Voucher::where('code', $request->voucher_code)
                    ->where('status', 1)
                    ->where(function ($q) {
                        $now = now();
                        $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
                    })
                    ->where(function ($q) {
                        $now = now();
                        $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', $now);
                    })
                    ->lockForUpdate()
                    ->first();

                if (!$voucher) {
                    throw new \Exception('Mã giảm giá không tồn tại hoặc đã hết hạn.');
                }

                if ($voucher->usage_limit !== null && $voucher->usage_count >= $voucher->usage_limit) {
                    throw new \Exception('Mã giảm giá đã hết lượt sử dụng.');
                }

                if ($voucher->usage_limit_per_user !== null) {
                    $used = Order::where('user_id', $userId)
                        ->where('voucher_code', $voucher->code)
                        ->whereIn('order_status', ['pending', 'confirmed', 'shipped', 'delivered'])
                        ->count();

                    if ($used >= $voucher->usage_limit_per_user) {
                        throw new \Exception('Bạn đã sử dụng mã giảm giá này rồi.');
                    }
                }

                if ($voucher->min_order_amount && $totalPrice < $voucher->min_order_amount) {
                    throw new \Exception('Đơn hàng chưa đạt giá trị tối thiểu để dùng mã.');
                }

                if ($voucher->discount_type === 'percentage') {
                    $discountAmount = $totalPrice * ($voucher->discount / 100);
                    if ($voucher->max_discount_amount) {
                        $discountAmount = min($discountAmount, $voucher->max_discount_amount);
                    }
                } else {
                    $discountAmount = $voucher->discount;
                }

                $discountAmount = min($discountAmount, $totalPrice);
                $voucher->increment('usage_count');

                $order->update([
                    'voucher_code'    => $voucher->code,
                    'discount_amount' => $discountAmount,
                ]);
            }

            $order->update([
                'total_price'   => $totalPrice,
                'discount_amount' => $discountAmount,
                'final_amount'  => $totalPrice - $discountAmount + $shippingFee,
            ]);

            $cart->items()->delete();
            $cart->delete();

            DB::commit();
            return $this->successResponse($order->load('orderItems'), 'Tạo đơn hàng thành công từ giỏ hàng', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Lỗi khi tạo đơn hàng: ' . $e->getMessage(), null, 500);
        }
    }




    public function applyVoucher(ApplyVoucherRequest $request)
    {
        $userId = $request->user()->id;

        $voucher = Voucher::where('code', $request->voucher_code)->first();

        $cart = Cart::with('items.product')->where('user_id', $userId)->first();
        $totalPrice = $cart->items->sum(fn($item) => $item->product->price * $item->quantity);

        $discountAmount = 0;
        if ($voucher->discount_type === 'percentage') {
            $discountAmount = $totalPrice * ($voucher->discount / 100);
            if ($voucher->max_discount_amount) {
                $discountAmount = min($discountAmount, $voucher->max_discount_amount);
            }
        } else {
            $discountAmount = $voucher->discount;
        }

        $discountAmount = min($discountAmount, $totalPrice);

        return $this->successResponse([
            'voucher_code'    => $voucher->code,
            'discount_type'   => $voucher->discount_type,
            'discount_amount' => round($discountAmount, 0),
            'original_price'  => $totalPrice,
            'final_price'     => $totalPrice - $discountAmount,
        ], 'Mã giảm giá hợp lệ');
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

        // --- Gọi GHN API ---
        $ghnShippingInfo = null;
        if ($order->order_code) {
            $token = env('GHN_TOKEN');
            $shopId = env('GHN_SHOP_ID');

            $res = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => $token,
                'ShopId' => $shopId,
            ])->post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail', [
                'order_code' => $order->order_code
            ]);

            if ($res->successful() && isset($res['data'])) {
                $ghnShippingInfo = $res['data'];
            }
        }

        $result = [
            'id' => $order->id,
            'order_code' => $order->order_code,
            'expected_delivery_time' => $order->expected_delivery_time,
            'final_amount' => $order->final_amount,
            'total_price' => $order->total_price,
            'voucher_code' => $order->voucher_code,
            'order_status' => $order->order_status,
            'cancel_reason' => $order->cancel_reason,
            'payment_status' => $order->payment_status,
            'shipping_address' => $order->shipping_address,
            'payment_method' => $order->payment_method,
            'shipped_at' => $order->shipped_at,
            'delivered_at' => $order->delivered_at,
            'discount_amount' => $order->discount_amount,
            'shipping_fee' => $order->shipping_fee,
            'shipping_name' => optional($order->shipping)->name,
            'recipient_name' => $order->recipient_name,
            'recipient_phone' => $order->recipient_phone,
            'recipient_email' => $order->recipient_email,
            'customer_id' => $order->customer_id,
            'shipping_id' => $order->shipping_id,
            'user' => $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ] : null,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => $order->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'category_id' => $item->product->category_id,
                        'name' => $item->product->name,
                        'description' => $item->product->description,
                        'image' => $item->product->image,
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
            'subtotal' => $order->orderItems->reduce(function ($carry, $item) {
                return $carry + ($item->price * $item->quantity);
            }, 0),
            // Gắn kết quả từ GHN
            'status' => $ghnShippingInfo['status'] ?? null,
            'leadtime_order' => $ghnShippingInfo['leadtime_order'] ?? null,
            'pickup_time' => $ghnShippingInfo['pickup_time'] ?? null,
            'finish_date' => $ghnShippingInfo['finish_date'] ?? null,
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

    /**
     * Cập nhật địa chỉ đơn hàng (chỉ cho phép ở trạng thái pending/confirming)
     */
    public function updateAddress(UpdateOrderAddressRequest $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại hoặc bạn không có quyền thay đổi', null, 404);
        }

        // Kiểm tra trạng thái đơn hàng - chỉ cho phép thay đổi ở trạng thái pending/confirming
        if (!in_array($order->order_status, ['pending', 'confirming'])) {
            return $this->errorResponse('Chỉ có thể thay đổi địa chỉ đơn hàng ở trạng thái chờ xác nhận hoặc đang xác nhận', null, 400);
        }

        try {
            // Nếu có address_id, sử dụng địa chỉ có sẵn
            if ($request->filled('address_id')) {
                $address = Address::where('id', $request->address_id)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$address) {
                    return $this->errorResponse('Địa chỉ không tồn tại hoặc không thuộc về bạn', null, 404);
                }

                $order->update([
                    'address_id' => $address->id,
                    'shipping_address' => $address->shipping_address ?? $address->address,
                    'recipient_name' => $address->recipient_name,
                    'recipient_phone' => $address->recipient_phone,
                    'recipient_email' => $address->recipient_email,
                ]);
            } else {
                // Sử dụng thông tin địa chỉ mới từ request
                $order->update([
                    'address_id' => null,
                    'shipping_address' => $request->shipping_address,
                    'recipient_name' => $request->recipient_name,
                    'recipient_phone' => $request->recipient_phone,
                    'recipient_email' => $request->recipient_email,
                ]);
            }

            Log::info('Order address updated by user', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'new_address' => $order->shipping_address
            ]);

            return $this->successResponse($order->load('address'), 'Cập nhật địa chỉ đơn hàng thành công');
        } catch (\Exception $e) {
            Log::error('Failed to update order address', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
                'user_id' => $user->id
            ]);
            return $this->errorResponse('Cập nhật địa chỉ đơn hàng thất bại: ' . $e->getMessage(), null, 500);
        }
    }
}
