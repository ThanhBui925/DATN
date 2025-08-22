<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class UpdateShippingStatus extends Command
{
    protected $signature = 'shipping:update-status';
    protected $description = 'Cập nhật trạng thái giao hàng từ GHN API mỗi 1 tiếng';

    public function handle()
    {
        // Lấy danh sách đơn đang shipping
        $orders = Order::where('order_status', 'shipping')
                ->where('shipping_status', '!=', 'cancel')
                ->get();

        if ($orders->isEmpty()) {
            $this->info('Không có đơn hàng nào đang shipping.');
            return;
        }

        foreach ($orders as $order) {
            if (!$order->order_code) {
                $this->warn("Đơn hàng ID {$order->id} không có mã GHN (order_code). Bỏ qua.");
                continue;
            }

            try {
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

                    if ($shippingStatus) {
                        $order->shipping_status = $shippingStatus;

                        if ($shippingStatus === 'delivered' && !in_array($order->order_status, ['delivered', 'completed'])) {
                            $order->order_status = 'delivered';
                            $order->delivered_at = Carbon::parse($ghnShippingInfo['leadtime_order']['delivered_date']);
                            $order->use_shipping_status = 0;
                        }

                        $order->save();
                        Log::info("Cập nhật trạng thái giao hàng cho đơn hàng ID {$order->id}: {$shippingStatus}");
                    }
                } else {
                    Log::error("Lỗi khi gọi API GHN cho đơn hàng ID {$order->id}: " . $res->body());
                }
            } catch (\Exception $e) {
                Log::error("Lỗi khi gọi API GHN cho đơn hàng ID {$order->id}: " . $e->getMessage());
            }
        }
    }
}
