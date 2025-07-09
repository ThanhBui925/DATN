<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Order;
use App\Models\Voucher;

class ApplyVoucherRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Đảm bảo đã xác thực Sanctum
    }

    public function rules()
    {
        return [
            'voucher_code' => 'required|string|exists:vouchers,code',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $voucher = Voucher::where('code', $this->voucher_code)
                ->where('status', 1)
                ->where(function ($q) {
                    $now = now();
                    $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
                })
                ->where(function ($q) {
                    $now = now();
                    $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', $now);
                })
                ->first();

            if (!$voucher) {
                $validator->errors()->add('voucher_code', 'Mã giảm giá không tồn tại hoặc đã hết hạn.');
                return;
            }

            if (!is_null($voucher->usage_limit) && $voucher->usage_count >= $voucher->usage_limit) {
                $validator->errors()->add('voucher_code', 'Mã giảm giá đã hết lượt sử dụng.');
            }

            if (!is_null($voucher->usage_limit_per_user)) {
                $used = Order::where('user_id', $this->user()->id)
                    ->where('voucher_code', $voucher->code)
                    ->whereIn('order_status', ['pending', 'confirmed', 'shipped', 'delivered'])
                    ->count();

                if ($used >= $voucher->usage_limit_per_user) {
                    $validator->errors()->add('voucher_code', 'Bạn đã dùng mã giảm giá này rồi.');
                }
            }

            if ($voucher->min_order_amount) {
                $cart = \App\Models\Cart::with('items.product')->where('user_id', $this->user()->id)->first();
                $totalPrice = $cart?->items->sum(fn($item) => $item->product->price * $item->quantity) ?? 0;

                if ($totalPrice < $voucher->min_order_amount) {
                    $validator->errors()->add('voucher_code', 'Đơn hàng chưa đủ giá trị tối thiểu để áp dụng mã.');
                }
            }
        });
    }
}

