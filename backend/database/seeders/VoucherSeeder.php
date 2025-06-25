<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        // Xoá dữ liệu cũ nếu cần
        Voucher::truncate();

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
            'start_date' => now()->subDay(),
            'expiry_date' => now()->addMonth(),
            'status' => 1,
        ]);

        Voucher::create([
            'code' => 'PERCENT15',
            'discount_type' => 'percentage',
            'discount' => 15,
            'max_discount_amount' => 30000,
            'min_order_amount' => 150000,
            'usage_limit' => 50,
            'usage_limit_per_user' => 1,
            'usage_count' => 0,
            'is_public' => false,
            'user_id' => 1, // Chỉ dành cho user_id = 1
            'start_date' => now(),
            'expiry_date' => now()->addWeeks(2),
            'status' => 1,
        ]);
    }
}
