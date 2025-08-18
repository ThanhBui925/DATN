<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CompleteDeliveredOrders extends Command
{
    protected $signature = 'orders:complete-delivered';
    protected $description = 'Tự động hoàn thành đơn hàng delivered sau 7 ngày';

    public function handle()
    {
        // Lấy những đơn delivered >= 7 ngày
        $sevenDaysAgo = Carbon::now()->subDays(7);

        $orders = Order::where('order_status', 'delivered')
            ->where('updated_at', '<=', $sevenDaysAgo)
            ->get();

        if ($orders->isEmpty()) {
            $this->info('Không có đơn hàng nào cần auto-complete.');
            Log::info('Không có đơn hàng nào cần auto-complete.');
            return;
        }

        foreach ($orders as $order) {
            $order->order_status = 'completed';
            $order->payment_status = 'paid';
            $order->use_shipping_status = 0;
            $order->completed_at = Carbon::now();
            $order->save();

            $this->info("Đơn hàng ID {$order->id} đã chuyển sang completed.");
            Log::info("Đơn hàng ID {$order->id} đã chuyển sang completed.");
        }
    }
}
