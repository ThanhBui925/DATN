<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ShopOrderSeeder extends Seeder
{
    public function run()
    {
        // Giả sử có user_id, customer_id, shipping_id tồn tại trong DB, bạn thay đổi cho phù hợp
        $userId = 1;
        $customerId = 1;
        $shippingId = 1;

        // Tạo 5 đơn hàng mẫu
        for ($i = 1; $i <= 5; $i++) {
            $orderId = DB::table('shop_order')->insertGetId([
                'date_order' => Carbon::now()->subDays(rand(1, 30)),
                'total_price' => 0, // Tạm để 0, sẽ update sau
                'order_status' => 'confirmed',
                'payment_status' => 'paid',
                'shipping_address' => '123 Đường ABC, Quận XYZ, TP.HCM',
                'payment_method' => 'cash',
                'shipped_at' => Carbon::now()->addDays(1),
                'delivered_at' => Carbon::now()->addDays(3),
                'user_id' => $userId,
                'customer_id' => $customerId,
                'shipping_id' => $shippingId,
                'recipient_name' => 'Nguyễn Văn A',
                'recipient_phone' => '0909123456',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Tạo các item cho đơn hàng
            $totalPrice = 0;
            $numberOfItems = rand(1, 4);
            for ($j = 1; $j <= $numberOfItems; $j++) {
                $quantity = rand(1, 3);
                $price = rand(10000, 100000); // giả sử giá sản phẩm trong khoảng này
                $variantId = 7; // giả sử variant_id từ 1 đến 10

                DB::table('shop_order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => rand(1, 20), // giả sử product_id từ 1 đến 20
                    'quantity' => $quantity,
                    'price' => $price,
                    'variant_id' => $variantId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $totalPrice += $quantity * $price;
            }

            // Update lại tổng tiền đơn hàng
            DB::table('shop_order')->where('id', $orderId)->update([
                'total_price' => $totalPrice
            ]);
        }
    }
}
