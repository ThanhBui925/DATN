<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;
use DB;
use App\Models\Cart;

class CancelUnpaidOrders extends Command
{
    protected $signature = 'orders:cancel-unpaid';
    protected $description = 'Tự động hủy các đơn hàng chưa thanh toán sau 15 phút';

    public function handle()
    {
        $timeout = now()->subMinutes(3);

        $orders = Order::where('order_status', 'pending')
            ->where('payment_status', 'unpaid')
            ->where('payment_method', 'vnpay')
            ->where('created_at', '<=', $timeout)
            ->get();

        $count = 0;

        foreach ($orders as $order) {
            DB::beginTransaction();
            try {
                \Log::info("Hủy đơn hàng {$order->id} do quá thời gian thanh toán");
                foreach ($order->orderItems as $item) {
                    $variant = \App\Models\VariantProduct::find($item->variant_id);
                    if ($variant) {
                        $variant->increment('quantity', $item->quantity);
                    }
                }

                $order->order_status = 'canceled';
                $order->cancel_reason = 'Đơn hàng tự động hủy do quá thời gian thanh toán';
                $order->save();

                $userId = $order->user_id;
                $cart = Cart::with('items')->where('user_id', $userId)->first();
                if ($cart) {
                    $cart->items()->delete();
                    $cart->delete();
                }
                

                DB::commit();
                $count++;
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error("Không thể hủy đơn {$order->id}: " . $e->getMessage());
            }
        }

        $this->info("Đã tự động hủy $count đơn hàng chưa thanh toán quá 15 phút.");
    }
}

