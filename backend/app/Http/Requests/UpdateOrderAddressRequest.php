<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'address_id' => 'nullable|exists:addresses,id',
            'shipping_address' => 'required_without:address_id|string|max:255',
            'recipient_name' => 'required_without:address_id|string|max:255',
            'recipient_phone' => 'required_without:address_id|regex:/^[0-9+\-\s()]+$/|max:20',
            'recipient_email' => 'required_without:address_id|email|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'address_id.exists' => 'Địa chỉ không tồn tại trong hệ thống.',
            'shipping_address.required_without' => 'Địa chỉ giao hàng là bắt buộc khi không chọn địa chỉ có sẵn.',
            'shipping_address.string' => 'Địa chỉ giao hàng phải là chuỗi.',
            'shipping_address.max' => 'Địa chỉ giao hàng không được vượt quá 255 ký tự.',
            'recipient_name.required_without' => 'Tên người nhận là bắt buộc khi không chọn địa chỉ có sẵn.',
            'recipient_name.string' => 'Tên người nhận phải là chuỗi.',
            'recipient_name.max' => 'Tên người nhận không được vượt quá 255 ký tự.',
            'recipient_phone.required_without' => 'Số điện thoại người nhận là bắt buộc khi không chọn địa chỉ có sẵn.',
            'recipient_phone.string' => 'Số điện thoại người nhận phải là chuỗi.',
            'recipient_phone.regex' => 'Số điện thoại người nhận không đúng định dạng.',
            'recipient_phone.max' => 'Số điện thoại người nhận không được vượt quá 20 ký tự.',
            'recipient_email.required_without' => 'Email người nhận là bắt buộc khi không chọn địa chỉ có sẵn.',
            'recipient_email.email' => 'Email người nhận không đúng định dạng.',
            'recipient_email.max' => 'Email người nhận không được vượt quá 255 ký tự.',
        ];
    }
} 