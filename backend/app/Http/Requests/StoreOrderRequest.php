<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:variant_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'recipient_name' => 'required|string',
            'recipient_phone' => 'required|string',
            'payment_method' => 'required|in:cash,card,paypal,vnpay',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
        ];
    }

    public function messages()
    {
        return [
            'items.required' => 'Danh sách sản phẩm không được để trống.',
            'items.array' => 'Danh sách sản phẩm phải là mảng.',
            'items.min' => 'Cần ít nhất một sản phẩm.',
            'items.*.product_id.required' => 'Thiếu mã sản phẩm.',
            'items.*.product_id.exists' => 'Sản phẩm không tồn tại.',
            'items.*.variant_id.exists' => 'Biến thể sản phẩm không hợp lệ.',
            'items.*.quantity.required' => 'Thiếu số lượng sản phẩm.',
            'items.*.quantity.integer' => 'Số lượng phải là số.',
            'items.*.quantity.min' => 'Số lượng tối thiểu là 1.',
            'shipping_address.required' => 'Địa chỉ giao hàng là bắt buộc.',
            'recipient_name.required' => 'Tên người nhận là bắt buộc.',
            'recipient_phone.required' => 'Số điện thoại người nhận là bắt buộc.',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
            'voucher_code.exists' => 'Mã giảm giá không hợp lệ.',
        ];
    }
} 