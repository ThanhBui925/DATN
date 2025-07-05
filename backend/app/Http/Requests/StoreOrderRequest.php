<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:variant_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string|max:500',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'payment_method' => 'required|in:cash,cod,online',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Danh sách sản phẩm là bắt buộc.',
            'items.array' => 'Danh sách sản phẩm phải là mảng.',
            'items.min' => 'Phải có ít nhất 1 sản phẩm trong đơn hàng.',
            'items.*.product_id.required' => 'ID sản phẩm là bắt buộc.',
            'items.*.product_id.exists' => 'Sản phẩm không tồn tại.',
            'items.*.variant_id.exists' => 'Biến thể sản phẩm không tồn tại.',
            'items.*.quantity.required' => 'Số lượng sản phẩm là bắt buộc.',
            'items.*.quantity.integer' => 'Số lượng phải là số nguyên.',
            'items.*.quantity.min' => 'Số lượng phải lớn hơn 0.',
            'shipping_address.required' => 'Địa chỉ giao hàng là bắt buộc.',
            'shipping_address.max' => 'Địa chỉ giao hàng không được vượt quá 500 ký tự.',
            'recipient_name.required' => 'Tên người nhận là bắt buộc.',
            'recipient_name.max' => 'Tên người nhận không được vượt quá 255 ký tự.',
            'recipient_phone.required' => 'Số điện thoại người nhận là bắt buộc.',
            'recipient_phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
            'voucher_code.exists' => 'Mã voucher không tồn tại.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'status' => 'false',
            'errors' => $validator->errors(),
        ], 422));
    }
} 