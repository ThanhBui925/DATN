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
use App\Services\ShippingFeeService;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lấy danh sách tất cả đơn hàng (Admin)
     */
    public function index(Request $request)
{
    $query = Order::query()->with(['customer', 'shipping', 'user']);

    // Lọc theo mã đơn (order_code)
    if ($request->filled('order_code')) {
        $query->where('id', 'like', '%' . trim($request->input('order_code')) . '%');
    }

    // Lọc theo ngày cụ thể (order_date)
    if ($request->filled('order_date')) {
        $date = Carbon::parse($request->input('order_date'))->format('Y-m-d');
        $query->whereDate('date_order', $date);
    }

    // Lọc theo tháng và năm
    if ($request->filled('month') && $request->filled('year')) {
        $query->whereMonth('date_order', $request->input('month'))
              ->whereYear('date_order', $request->input('year'));
    }

    // Lọc theo khoảng thời gian
    if ($request->filled('start_date') && $request->filled('end_date')) {
        $query->whereBetween('date_order', [
            Carbon::parse($request->input('start_date'))->startOfDay(),
            Carbon::parse($request->input('end_date'))->endOfDay()
        ]);
    }

    // Lọc theo trạng thái
    if ($request->filled('status')) {
        $status = $request->input('status');
        $query->where(function ($q) use ($status) {
            $q->where(function ($sub) use ($status) {
                $sub->where('use_shipping_status', 1)
                    ->where('shipping_status', $status);
            })->orWhere(function ($sub) use ($status) {
                $sub->where('use_shipping_status', 0)
                    ->where('order_status', $status);
            });
        });
    }

    // Lọc theo user_id
    if ($request->filled('user_id')) {
        $query->where('user_id', $request->input('user_id'));
    }

    // Lọc theo phone (từ customer)
    if ($request->filled('phone')) {
        $query->where('shop_order.recipient_phone', 'like', '%' . trim($request->input('phone')) . '%');
    }
    $orders = $query->orderBy('created_at', 'desc')->get();

    // Gán status chung để frontend dễ đọc
    $orders->transform(function ($order) {
        $order->status = $order->use_shipping_status
            ? $order->shipping_status
            : $order->order_status;
        return $order;
    });

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
            'return',
            'return.evidences'
        ])->find($id);

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        $shipping_address = implode(', ', array_filter([
            $order->detailed_address ?? '',
            $order->ward_name ?? '',
            $order->district_name ?? '',
            $order->province_name ?? '',
        ]));

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

            $ghnShippingInfo = null;
            $shippingStatus = null;

            if ($res->successful() && isset($res['data'])) {
                $ghnShippingInfo = $res['data'];
                $shippingStatus = $ghnShippingInfo['status'] ?? null;
            }

            if ($shippingStatus == 'delivered' && $order->use_shipping_status == 1 && $order->order_status !== 'delivered') {
                $order->shipping_status = $shippingStatus;

                if ($shippingStatus == 'delivered') {
                    $order->order_status = 'delivered';
                    $order->delivered_at = isset($ghnShippingInfo['leadtime_order']['delivered_date'])
                        ? Carbon::parse($ghnShippingInfo['leadtime_order']['delivered_date'])
                        : Carbon::now();
                    $order->use_shipping_status = 0;
                }

                $order->save();
            }
        }
        $status = $order->use_shipping_status == 1 ? $order->shipping_status : $order->order_status;


        $result = [
            'id' => $order->id,
            'date_order' => $order->created_at,
            'total_price' => $order->total_price,
            'order_status' => $order->order_status,
            'cancel_reason' => $order->cancel_reason,
            'payment_status' => $order->payment_status,
            'shipping_address' => $shipping_address,
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
            'voucher_code' => $order->voucher_code,
            'shipping_fee' => $order->shipping_fee,
            'final_amount' => $order->final_amount,
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
            'status' => $status,
            'leadtime_order' => $ghnShippingInfo['leadtime_order'] ?? null,
            'pickup_time' => $ghnShippingInfo['pickup_time'] ?? null,
            'finish_date' => $ghnShippingInfo['finish_date'] ?? null,
            'return' => $order->return,
        ];


        return $this->successResponse($result, 'Lấy thông tin đơn hàng thành công');
    }

    //Hoàn tiền đơn hàng
    public function refundOrder(Request $request, $id)
    {
        $order = Order::find($id); 
        Log::info('Refunding order', [
            'order_id' => $id,
            'request' => $request->all(),
        ]);

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        // Kiểm tra điều kiện hoàn tiền
        if (!in_array($order->order_status, ['return_accepted', 'canceled'])) {
            return $this->errorResponse('Đơn hàng không đủ điều kiện hoàn tiền', null, 400);
        }

        $transactionCode = $request->input('transaction_code');
        if (!$transactionCode) {
            return $this->errorResponse('Vui lòng nhập mã giao dịch hoàn tiền', null, 422);
        }

        \Log::info('Refunding order', [
            'order_id' => $order->id,
            'transaction_code' => $transactionCode,
        ]);

        if ($order->order_status === 'canceled') {
            // Nếu đã hủy thì chỉ cập nhật payment_status
            $order->payment_status = 'refunded';
        } else {
            // Nếu return_accepted thì cập nhật cả order_status và payment_status
            $order->order_status = 'refunded';
            $order->payment_status = 'refunded';
        }
        $order->save();

        // Cập nhật trạng thái trả hàng (nếu có)
        $returnOrder = $order->return;
        \Log::info('returnOrder', [$returnOrder]);
        if ($returnOrder) {
            $returnOrder->transaction_code = $transactionCode;
            $returnOrder->save();
        }

        return $this->successResponse(
            $order->load(['customer', 'shipping', 'user']),
            'Hoàn tiền đơn hàng thành công'
        );
    }


    /**
     * Cập nhật trạng thái đơn hàng (Admin)
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order      = Order::findOrFail($id);
        $oldStatus  = trim(strtolower((string)$order->order_status));
        $newStatus  = trim(strtolower((string)$request->input('order_status')));

        $validTransitions = \App\Http\Requests\UpdateOrderStatusRequest::$validTransitions;

        if (!in_array($newStatus, $validTransitions[$oldStatus] ?? [])) {
            return $this->errorResponse(
                'Chuyển trạng thái không hợp lệ ' . $oldStatus . ' sang ' . $newStatus,
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

        $order->cancel_reason = $newStatus === 'canceled' ? $request->input('cancel_reason') : null;

        if ($newStatus === 'shipping' && !$order->shipped_at)   $order->shipped_at   = Carbon::now();
        if ($newStatus === 'delivered' && !$order->delivered_at) $order->delivered_at = Carbon::now();

        $order->save();

        // Xử lý GHN nếu trạng thái là shipping và chưa có order_code
        if ($newStatus === 'shipping' && !$order->order_code) {
            try {
                if ($order->address_id && $order->address) {
                    $address         = $order->address;
                    $recipientName   = $address->recipient_name;
                    $recipientPhone  = $address->recipient_phone;
                    $detailed_address= $address->address;
                    $wardName        = $address->ward_name;
                    $districtName    = $address->district_name;
                    $provinceName    = $address->province_name;
                } else {
                    $recipientName   = $order->recipient_name;
                    $recipientPhone  = $order->recipient_phone;
                    $detailed_address= $order->detailed_address;
                    $wardName        = $order->ward_name;
                    $districtName    = $order->district_name;
                    $provinceName    = $order->province_name;
                }

                $toProvinceId = ShippingFeeService::matchProvinceByName($provinceName);
                $toDistrictId = ShippingFeeService::matchDistrictByName($toProvinceId['ProvinceID'] ?? null, $districtName);
                $toWardCode   = ShippingFeeService::matchWardByName($toDistrictId['DistrictID'] ?? null, $wardName);

                if (!$toProvinceId || !$toDistrictId || !$toWardCode) {
                    $order->order_status = $oldStatus;
                    $order->save();
                    return $this->errorResponse("Không tìm được ID địa chỉ từ tên đã lưu trong đơn hàng.", null, 400);
                }

                $shippingData = [
                    'province_id' => $toProvinceId['ProvinceID'],
                    'district_id' => $toDistrictId['DistrictID'],
                    'ward_code'   => $toWardCode['WardCode'],
                ];

                $shippingAddress = implode(', ', array_filter([$detailed_address, $wardName, $districtName, $provinceName]));
                $items = $order->orderItems->map(fn($item) => [
                    'name'     => $item->product->name ?? 'Sản phẩm',
                    'quantity' => (int)$item->quantity,
                    'price'    => (int)$item->price,
                ])->toArray();

                $ghnResponse = ShippingFeeService::createOrder(
                    $order,
                    $recipientName,
                    $recipientPhone,
                    $shippingAddress,
                    $shippingData,
                    $items,
                    $oldStatus
                );

                if (!isset($ghnResponse['code']) || (int)$ghnResponse['code'] !== 200) {
                    $order->order_status = $oldStatus;
                    $order->save();
                    return $this->errorResponse('Tạo đơn GHN thất bại: ' . ($ghnResponse['message'] ?? json_encode($ghnResponse)), null, 500);
                }

                // Cập nhật thông tin GHN
                $order->order_code         = $ghnResponse['data']['order_code'] ?? null;
                $order->use_shipping_status= 1;
                $order->shipping_status    = 'ready_to_pick';
                $order->save();

            } catch (\Exception $e) {
                $order->order_status = $oldStatus;
                $order->save();
                return $this->errorResponse("GHN tạo đơn thất bại: " . $e->getMessage(), null, 500);
            }
        }

        //Nếu trạng thái là return_rejected, xóa toàn bộ thông tin trả hàng và lưu lý do từ chối
        if ($newStatus === 'return_rejected') {
            $reason = $request->input('reject_reason');

            if (!$reason) {
                // rollback lại trạng thái cũ
                $order->order_status = $order->getOriginal('order_status');
                $order->save();

                return $this->errorResponse('Vui lòng nhập lý do từ chối trả hàng', null, 422);
            }

            // Nếu có lý do thì lưu lại vào return_order
            $returnOrder = $order->return;
            if ($returnOrder) {
                $returnOrder->reason_for_refusal = $reason;
                $returnOrder->save();
            }
        }

        // if ($newStatus === 'refunded') {
        //     $transactionCode = $request->input('transaction_code');

        //     if (!$transactionCode) {
        //         // rollback lại trạng thái cũ
        //         $order->order_status = $order->getOriginal('order_status');
        //         $order->save();

        //         return $this->errorResponse('Vui lòng nhập mã giao dịch hoàn tiền', null, 422);
        //     }

        //     // Nếu có transaction_code thì lưu
        //     $returnOrder = $order->return;
        //     if ($returnOrder) {
        //         $returnOrder->transaction_code = $transactionCode;
        //         $returnOrder->save();
        //     }
        // }



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