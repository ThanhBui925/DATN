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
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Requests\StoreAdminOrderRequest;

class OrderController extends Controller
{
    use ApiResponseTrait;
    


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

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        return $this->successResponse($orders, 'Lấy danh sách đơn hàng thành công');
    }

    /**
     * Tạo đơn hàng mới (Admin)
     */
    public function store(StoreAdminOrderRequest $request)
    {
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
                    throw new \Exception("Sản phẩm {$product->name} không đủ tồn kho (Có: {$availableStock}, Cần: {$item['quantity']})");
                }

                $itemPrice = $variant ? $variant->price : $product->sale_price ?: $product->price;
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
            if ($request->has('voucher_code') && $request->input('voucher_code')) {
                $voucher = Voucher::where('code', $request->input('voucher_code'))
                    ->where('status', 'active')
                    ->where('start_date', '<=', Carbon::now())
                    ->where('end_date', '>=', Carbon::now())
                    ->first();

                if ($voucher) {
                    // Kiểm tra xem user đã sử dụng voucher này chưa
                    $usedVoucher = VoucherUser::where('user_id', $request->input('user_id'))
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

            $finalTotal = max(0, $totalPrice - $discountAmount);

            // Tạo đơn hàng
            $order = Order::create([
                'user_id' => $request->input('user_id'),
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
                    'user_id' => $request->input('user_id'),
                    'voucher_id' => $voucher->id,
                    'used_at' => Carbon::now(),
                ]);
            }

            DB::commit();

            $order->load(['orderItems.product', 'orderItems.variant.size', 'orderItems.variant.color', 'voucher']);

            return $this->successResponse($order, 'Tạo đơn hàng thành công', 201);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to create order', ['error' => $e->getMessage()]);
            return $this->errorResponse('Tạo đơn hàng thất bại: ' . $e->getMessage(), null, 500);
        }
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
            'orderItems.product', 
            'orderItems.variant.size', 
            'orderItems.variant.color',
            'voucher'
        ])->find($id);

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        return $this->successResponse($order, 'Lấy thông tin đơn hàng thành công');
    }

    /**
     * Cập nhật trạng thái đơn hàng (Admin)
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order = Order::find($id);
        
        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        $newStatus = $request->input('order_status');
        $currentStatus = $order->order_status;

        // Cập nhật trạng thái
        $order->order_status = $newStatus;
        
        // Cập nhật payment_status nếu cần
        if ($newStatus === 'delivered' || $newStatus === 'completed') {
            $order->payment_status = 'paid';
        }

        // Cập nhật cancel_reason nếu hủy đơn hàng
        if ($newStatus === 'canceled' && $request->has('cancel_reason')) {
            $order->cancel_reason = $request->input('cancel_reason');
        }

        $order->save();

        return $this->successResponse($order, 'Cập nhật trạng thái đơn hàng thành công');
    }

    /**
     * Tìm kiếm đơn hàng theo tên sản phẩm (Admin)
     */
    public function searchByProduct(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|min:1'
        ], [
            'product_name.required' => 'Tên sản phẩm là bắt buộc',
            'product_name.min' => 'Tên sản phẩm phải có ít nhất 1 ký tự'
        ]);

        $productName = $request->input('product_name');
        
        $orders = Order::whereHas('orderItems.product', function($query) use ($productName) {
            $query->where('name', 'like', "%{$productName}%");
        })
        ->with(['customer', 'shipping', 'user', 'orderItems.product'])
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        return $this->successResponse($orders, 'Tìm kiếm đơn hàng thành công');
    }

    /**
     * Tạo file PDF cho đơn hàng (Admin)
     */
    public function generatePDF($id)
    {
        $order = Order::with([
            'customer', 
            'shipping', 
            'user', 
            'orderItems.product', 
            'orderItems.variant.size', 
            'orderItems.variant.color',
            'voucher'
        ])->find($id);

        if (!$order) {
            return $this->errorResponse('Đơn hàng không tồn tại', null, 404);
        }

        try {
            $pdf = Pdf::loadView('pdf.invoice', compact('order'));
            
            $filename = 'invoice-' . $order->id . '-' . date('Y-m-d-H-i-s') . '.pdf';
            
            return $pdf->download($filename);
        } catch (\Exception $e) {
            Log::error('PDF generation failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Không thể tạo file PDF', null, 500);
        }
    }
}