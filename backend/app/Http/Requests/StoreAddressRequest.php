<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class StoreAddressRequest extends FormRequest
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
            'address' => 'required|string|max:255',
            'province_name' => 'required|string|max:100',
            'district_name' => 'required|string|max:100',
            'ward_name' => 'required|string|max:100',
            'recipient_name' => 'required|string|max:100',
            'recipient_phone' => 'required|string|max:20',
            'recipient_email' => 'required|string|max:100',
            'is_default' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'address.required' => 'Địa chỉ là bắt buộc.',
            'address.string' => 'Địa chỉ phải là chuỗi.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

            'province_name.required' => 'Tên tỉnh/thành phố là bắt buộc.',
            'province_name.string' => 'Tên tỉnh/thành phố phải là chuỗi.',
            'province_name.max' => 'Tên tỉnh/thành phố không được vượt quá 100 ký tự.',

            'district_name.required' => 'Tên quận/huyện là bắt buộc.',
            'district_name.string' => 'Tên quận/huyện phải là chuỗi.',
            'district_name.max' => 'Tên quận/huyện không được vượt quá 100 ký tự.',

            'ward_name.required' => 'Tên phường/xã là bắt buộc.',
            'ward_name.string' => 'Tên phường/xã phải là chuỗi.',
            'ward_name.max' => 'Tên phường/xã không được vượt quá 100 ký tự.',

            'recipient_name.required' => 'Tên người nhận là bắt buộc.',
            'recipient_name.string' => 'Tên người nhận phải là chuỗi.',
            'recipient_name.max' => 'Tên người nhận không được vượt quá 100 ký tự.',

            'recipient_phone.required' => 'Số điện thoại người nhận là bắt buộc.',
            'recipient_phone.string' => 'Số điện thoại người nhận phải là chuỗi.',
            'recipient_phone.max' => 'Số điện thoại người nhận không được vượt quá 20 ký tự.',

            'recipient_email.required' => 'Email người nhận là bắt buộc.',
            'recipient_email.string' => 'Email người nhận phải là chuỗi.',
            'recipient_email.max' => 'Email người nhận không được vượt quá 100 ký tự.',

            'is_default.boolean' => 'Trường "mặc định" phải là true hoặc false.',
        ];
    }

}
