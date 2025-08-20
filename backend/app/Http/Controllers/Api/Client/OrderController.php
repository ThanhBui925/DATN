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
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderSuccessMail;
use Illuminate\Support\Facades\Cache;
use App\Models\ReturnOrder as ReturnRequest;
use App\Models\ReturnEviden as ReturnEvidence;
use Illuminate\Support\Facades\Storage;






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
            ->with([
                'customer',
                'shipping',
                'user',
                'orderItems.product',
                'orderItems.variant.size',
                'orderItems.variant.color',
                'orderItems.variant.images'
            ]);

        // Lọc theo trạng thái dựa theo giá trị use_shipping_status đã lưu trong DB
        if ($request->has('status')) {
            $query->where(function ($q) use ($request) {
                $q->where(function ($sub) use ($request) {
                    $sub->where('use_shipping_status', 1)
                        ->where('shipping_status', $request->input('status'));
                })->orWhere(function ($sub) use ($request) {
                    $sub->where('use_shipping_status', 0)
                        ->where('order_status', $request->input('status'));
                });
            });
        }

        // Lọc theo ngày nếu có
        if ($request->has('date')) {
            $date = Carbon::parse($request->input('date'))->format('Y-m-d');
            $query->whereDate('created_at', $date);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        // Thêm trường `status` dựa vào use_shipping_status trong từng đơn hàng
        $orders->getCollection()->transform(function ($order) {
            $order->status = $order->use_shipping_status
                ? $order->shipping_status
                : $order->order_status;
            return $order;
        });

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

            $cartItemsIds = json_decode($request->input('cartItemsId'), true);

            $cart = Cart::with('items')->where('user_id', $userId)->first();
            if (!$cart || $cart->items->isEmpty()) {
                return $this->errorResponse('Giỏ hàng trống hoặc không tồn tại.', null, 400);
            }

            $cartItemsIds = json_decode($request->input('cartItemsId'), true);
            if (empty($cartItemsIds) || !is_array($cartItemsIds)) {
                return $this->errorResponse('Danh sách sản phẩm không hợp lệ', 400);
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
                'shipping_status' => 'pending',
                'use_shipping_status' => 0,
                

            ]);

            $cartItems = $cart->items->whereIn('id', $cartItemsIds);

            foreach ($cartItems as $item) {
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
                $order->update([
                    'voucher_code'    => $voucher->code,
                    'discount_amount' => round($discountAmount, 0),
                ]);

                $voucher->increment('usage_count');
            }


            $order->update([
                'total_price'   => $totalPrice,
                'discount_amount' => $discountAmount,
                'final_amount'  => $totalPrice - $discountAmount + $shippingFee,
            ]);

            if ($request->payment_method === 'vnpay') {
                DB::commit();
            
                // Lưu cache với key là mã đơn hàng
                Cache::put('vnpay_order_cart_items_' . $order->id, $cartItemsIds, now()->addMinutes(30)); // hoặc addHour(1)
            
                $paymentUrl = app(\App\Services\VnPayService::class)->createPaymentUrl($order);
            
                return $this->successResponse([
                    'order' => $order->load('orderItems'),
                    'cartItemsIds' => $cartItemsIds,
                    'payment_url' => $paymentUrl
                ], 'Tạo đơn hàng và chuyển đến VNPay', 201);
            }
            

            $cart->items()->whereIn('id', $cartItemsIds)->delete(); 

            DB::commit();
            //Gửi mail thông báo đặt đơn hàng thành công
            Mail::to($order->user->email)->queue(new OrderSuccessMail($order)); // người đặt
            if ($order->recipient_email && $order->recipient_email !== $order->user->email) {
                Mail::to($order->recipient_email)->queue(new OrderSuccessMail($order)); // người nhận nếu khác
            }
            // //Gửi mail thông báo cho admin
            // $emails = $admins->pluck('email')->toArray();
            // Mail::to($emails)->queue(new OrderSuccessMail($order, true));


            return $this->successResponse($order->load('orderItems'), 'Tạo đơn hàng thành công từ giỏ hàng', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Lỗi khi tạo đơn hàng: ' . $e->getMessage(), null, 500);
        }
    }

    public function retryVNPay(Request $request, $id)
    {
        $order = Order::with('orderItems')->findOrFail($id);

        if ($order->order_status !== 'pending' || $order->payment_method !== 'vnpay' || $order->payment_status !== 'unpaid') {
            return $this->errorResponse('Đơn hàng không hợp lệ để thanh toán lại.', 400);
        }

        // Tạo lại link thanh toán
        $paymentUrl =  app(\App\Services\VnPayService::class)->createPaymentUrl($order);
        if (!$paymentUrl) {
            return $this->errorResponse('Không thể tạo link thanh toán, vui lòng thử lại sau.', 500);
        }
        return $this->successResponse([
            'payment_url' => $paymentUrl
        ],  'Tạo link thanh toán chuyển đến VNPay', 201);
    }



    public function applyVoucher(ApplyVoucherRequest $request)
    {
        $userId = $request->user()->id;

        $voucher = Voucher::where('code', $request->voucher_code)->first();

        $cart = Cart::with('items.product')->where('user_id', $userId)->first();
        $items = $cart->items->filter(fn($item) => $item->product);
        $totalPrice = $items->reduce(function ($carry, $item) {
            return $carry + ($item->product->price * $item->quantity);
        }, 0);


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
    private function resolveStatus($order_status, $shippingStatus)
    {
        if ($order_status === 'shipping') {
            if ($shippingStatus) {
                return match ($shippingStatus) {
                    'ready_to_pick' => 'ready_to_pick',
                    'picking', 'money_collect_picking' => 'picking',
                    'picked' => 'picked',
                    'storing', 'transporting', 'sorting', 'money_collect_delivering', 'delivering' => 'delivering',
                    'delivered' => 'delivered',
                    'delivery_fail', 'waiting_to_return', 'return', 'return_transporting', 'return_sorting', 'returning', 'return_fail', 'returned' => 'return_failed',
                    default => $order_status,
                };
            }

            return $order_status;
        }


        if (in_array($order_status, ['pending', 'preparing', 'confirmed', 'completed', 'canceled'])) {
            return $order_status;
        }

        if ($order_status === 'delivered') {
            return 'delivered';
        }

        if ($order_status === 'canceled') {
            return 'canceled';
        }

        return 'unknown';
    }

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
                'orderItems.variant.images',
            ])->first();

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại hoặc bạn không có quyền truy cập', null, 404);
        }


        $ghnShippingInfo = null;
        $shippingStatus = null;

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
                $shippingStatus = $ghnShippingInfo['status'] ?? null;
            }

            if ($shippingStatus) {
                $order->shipping_status = $shippingStatus;

                if ($shippingStatus === 'delivered' && !in_array($order->order_status, ['delivered', 'completed'])) {
                    $order->order_status = 'delivered';
                    $order->use_shipping_status = 0;
                }

                $order->save();
            }
        }

        $leadtime = $ghnShippingInfo['leadtime_order'] ?? null;

        $leadtimeData = null;

        $status = $order->use_shipping_status == 1 ? $order->shipping_status : $order->order_status;

        if (!empty($leadtime['delivered_date'])) {
            $leadtimeData = [
                'delivered_date' => $leadtime['delivered_date'],
            ];
        } elseif (!empty($leadtime['from_estimate_date']) || !empty($leadtime['to_estimate_date'])) {
            $leadtimeData = [
                'from_estimate_date' => $leadtime['from_estimate_date'] ?? null,
                'to_estimate_date' => $leadtime['to_estimate_date'] ?? null,
            ];
        }



        $shipping_address = implode(', ', array_filter([
            $order->detailed_address ?? '',
            $order->ward_name ?? '',
            $order->district_name ?? '',
            $order->province_name ?? '',
        ]));


        $result = [
            'id' => $order->id,
            'order_code' => $order->order_code,
            'expected_delivery_time' => $order->expected_delivery_time,
            'final_amount' => $order->final_amount,
            'total_price' => $order->total_price,
            'voucher_code' => $order->voucher_code,
            // 'order_status' => $order->order_status,
            'cancel_reason' => $order->cancel_reason,
            'payment_status' => $order->payment_status,
            'shipping_address' => $shipping_address,
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
                        'images' => $item->variant->images,
                    ] : null,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'is_review' => $item->is_review,
                ];
            }),
            'subtotal' => $order->orderItems->reduce(function ($carry, $item) {
                return $carry + ($item->price * $item->quantity);
            }, 0),
            // Gắn kết quả từ GHN
            'status' => $status,
            'leadtime_order' => $leadtimeData,
            'picked_date' => $ghnShippingInfo['leadtime_order']['picked_date'] ?? null,
            'date_order' => $order->date_order,
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

        if (in_array($order->order_status, ['delivered', 'canceled'])) {
            return $this->errorResponse('Không thể hủy đơn hàng đã giao hoặc đã bị hủy', null, 400);
        }

        $rules = [
            'cancel_reason' => 'required|string|max:500',
        ];
        $messages = [
            'cancel_reason.required' => 'Lý do hủy đơn hàng là bắt buộc',
            'cancel_reason.max'      => 'Lý do hủy đơn hàng không được vượt quá 500 ký tự',
        ];

        if ($order->payment_status === 'paid' && $order->payment_method === 'vnpay') {
            $rules = array_merge($rules, [
                'refund_bank'            => 'required|string|max:100',
                'refund_account_name'    => 'required|string|max:100',
                'refund_account_number'  => 'required|string|max:50',
            ]);
            $messages = array_merge($messages, [
                'refund_bank.required'           => 'Vui lòng nhập tên ngân hàng',
                'refund_account_name.required'   => 'Vui lòng nhập tên chủ tài khoản',
                'refund_account_number.required' => 'Vui lòng nhập số tài khoản',
            ]);
        }

        $validated = $request->validate($rules, $messages);

        try {
            if (!empty($order->order_code)) {
                $ghnResponse = Http::withHeaders([
                    'Token' => env('GHN_TOKEN'),
                    'ShopId' => env('GHN_SHOP_ID'),
                    'Content-Type' => 'application/json',
                ])->post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel', [
                    'order_codes' => [$order->order_code],
                ]);

                if (!$ghnResponse->successful() || $ghnResponse->json('code') != 200) {
                    return $this->errorResponse('Không thể hủy đơn GHN: ' . $ghnResponse->json('message'), null, 400);
                }
            }

            if ($order->payment_status === 'paid' && $order->payment_method === 'vnpay') {
                $returnOrder = new ReturnRequest();
                $returnOrder->order_id = $order->id;
                $returnOrder->user_id = $user->id;
                $returnOrder->reason = $validated['cancel_reason'] ?? null;
                $returnOrder->refund_bank = $validated['refund_bank'];
                $returnOrder->refund_account_name = $validated['refund_account_name'];
                $returnOrder->refund_account_number = $validated['refund_account_number'];
                $returnOrder->save();

                $order->order_status = 'return_accepted';
                $order->payment_status = 'waiting_for_refund';
            } else {
                $order->order_status = 'canceled';
            }

            $order->cancel_reason = $validated['cancel_reason'];
            $order->save();


            foreach ($order->orderItems as $item) {
                $variant = \App\Models\VariantProduct::find($item->variant_id);
                if ($variant) {
                    $variant->increment('quantity', $item->quantity);
                }
            }

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
        if (!in_array($order->order_status, ['pending', 'confirming', 'confirmed'])) {
            return $this->errorResponse('Chỉ có thể thay đổi địa chỉ đơn hàng ở trạng thái chờ xác nhận hoặc đã xác nhận', null, 400);
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

    public function complete(Request $request, $id)
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

        if ($order->order_status !== 'delivered') {
            return response()->json([
                'status' => false,
                'message' => 'Chỉ được xác nhận hoàn tất khi đơn đã giao.'
            ]);
        }

        $order->order_status = 'completed';

        if ($order->payment_status !== 'paid') {
            $order->payment_status = 'paid';
        }

        $order->save();

        return response()->json([
            'status' => true,
            'message' => 'Đã xác nhận hoàn tất đơn hàng.'
        ]);
    }

    //Yêu cầu hoàn hàng
    public function requestReturn(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại hoặc bạn không có quyền yêu cầu hoàn hàng', null, 404);
        }

        if ($order->order_status === 'return_requested') {
            return $this->errorResponse('Đơn hàng đã có yêu cầu hoàn hàng trước đó', null, 400);
        }

        if (!in_array($order->order_status, ['completed'])) {
            return $this->errorResponse('Chỉ có thể yêu cầu hoàn hàng khi đơn đã giao hoặc hoàn thành', null, 400);
        }

        // Lấy tất cả input trước validate để chắc chắn nhận được return_reason
        $input = $request->all();
        Log::info('Request return input', [
            'user_id' => $user->id,
            'order_id' => $order->id,
            'input' => $input
        ]);

        // Build rules và messages
        $rules = [
            'return_reason' => 'required|string|max:500',
            'return_images' => 'nullable|array',
            'return_images.*' => 'file|mimes:jpg,jpeg,png,mp4|max:20480',
        ];

        $messages = [
            'return_reason.required' => 'Vui lòng nhập lý do trả hàng',
            'return_images.array'    => 'Hình ảnh phải là một mảng',
            'return_images.*.file'   => 'Mỗi file phải là tệp hợp lệ',
            'return_images.*.mimes'  => 'Hình ảnh/video chỉ chấp nhận jpg, jpeg, png, mp4',
            'return_images.*.max'    => 'Dung lượng mỗi tệp tối đa 20MB',
        ];

        // Nếu đơn đã thanh toán VNPAY thì bắt buộc thông tin ngân hàng
        if ($order->payment_method === 'vnpay' && $order->payment_status === 'paid') {
            $rules = array_merge($rules, [
                'refund_bank'            => 'required|string|max:100',
                'refund_account_name'    => 'required|string|max:100',
                'refund_account_number'  => 'required|string|max:50',
            ]);
            $messages = array_merge($messages, [
                'refund_bank.required'           => 'Vui lòng nhập tên ngân hàng',
                'refund_account_name.required'   => 'Vui lòng nhập tên chủ tài khoản',
                'refund_account_number.required' => 'Vui lòng nhập số tài khoản',
            ]);
        }

        // Validate
        $validated = validator($input, $rules, $messages)->validate();

        // Tạo record return
        $return = ReturnRequest::create([
            'order_id'              => $order->id,
            'user_id'               => $user->id,
            'reason'                => $validated['return_reason'],
            'refund_bank'           => $validated['refund_bank'] ?? null,
            'refund_account_name'   => $validated['refund_account_name'] ?? null,
            'refund_account_number' => $validated['refund_account_number'] ?? null,
        ]);

        // Lưu hình ảnh/video
        if ($request->hasFile('return_images')) {
            $images = [];
            $files = collect($request->file('return_images'))->flatten();

            foreach ($files as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('returns', 'public');
                    $fullUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);

                    $images[] = [
                        'return_id' => $return->id,
                        'file_path' => $fullUrl,
                        'file_type' => $file->getClientMimeType(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            if (!empty($images)) {
                ReturnEvidence::insert($images);
            }
        }


        $order->order_status = 'return_requested';
        $order->save();

        return $this->successResponse([
            'order'  => $order,
            'return' => $return->load('evidences'),
        ], 'Yêu cầu hoàn hàng thành công');
    }




}
