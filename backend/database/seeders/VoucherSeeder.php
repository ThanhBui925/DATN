<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Giảm giá cố định cho tất cả sản phẩm
        Voucher::create([
            'code' => 'FIXED50K',
            'discount_type' => 'fixed',
            'discount' => 50000,
            'max_discount_amount' => null,
            'min_order_amount' => 200000,
            'usage_limit' => 100,
            'usage_limit_per_user' => 2,
            'usage_count' => 0,
            'is_public' => true,
            'user_id' => null,
            'start_date' => now()->subDays(1),
            'expiry_date' => now()->addDays(30),
            'status' => true,
            'applies_to' => 'all',
        ]);

        // 2. Giảm 20% tối đa 100K, áp dụng cho sản phẩm cụ thể (ví dụ sẽ gán sau)
        Voucher::create([
            'code' => 'SALE20',
            'discount_type' => 'percentage',
            'discount' => 20,
            'max_discount_amount' => 100000,
            'min_order_amount' => 300000,
            'usage_limit' => 50,
            'usage_limit_per_user' => 1,
            'usage_count' => 0,
            'is_public' => true,
            'user_id' => null,
            'start_date' => now(),
            'expiry_date' => now()->addDays(10),
            'status' => true,
            'applies_to' => 'product',
        ]);

        // 3. Giảm 10% cho danh mục (gán sau), chỉ dành cho user cụ thể
        Voucher::create([
            'code' => 'PRIVATE10',
            'discount_type' => 'percentage',
            'discount' => 10,
            'max_discount_amount' => 50000,
            'min_order_amount' => 150000,
            'usage_limit' => 10,
            'usage_limit_per_user' => 1,
            'usage_count' => 0,
            'is_public' => false,
            'user_id' => 1, // giả định user có ID = 1
            'start_date' => now(),
            'expiry_date' => now()->addDays(5),
            'status' => true,
            'applies_to' => 'category',
        ]);
    }
}
