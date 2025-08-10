<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules()
{
    return [
        'address_id'       => 'nullable|exists:addresses,id',
        'detailed_address' => 'required_without:address_id|string|max:255',
        'ward_name'        => 'required_without:address_id|string|max:255',
        'district_name'    => 'required_without:address_id|string|max:255',
        'province_name'    => 'required_without:address_id|string|max:255',
        'payment_method'   => 'required|in:cash,card,paypal,vnpay',
        'shipping_id'      => 'nullable|exists:shipping,id',
        'recipient_name'  => 'required_without:address_id|nullable|string|max:255',
        'recipient_phone' => 'required_without:address_id|nullable|string|max:20',
        'recipient_email' => 'required_without:address_id|nullable|email|max:255',
    ];
}

public function messages(): array
{
    return [
        'address_id.exists' => 'Địa chỉ đã chọn không tồn tại.',

        'detailed_address.required_without' => 'Vui lòng nhập địa chỉ chi tiết khi không chọn địa chỉ có sẵn.',
        'detailed_address.string' => 'Địa chỉ chi tiết phải là chuỗi.',
        'detailed_address.max' => 'Địa chỉ chi tiết không được vượt quá 255 ký tự.',

        'ward_name.required_without' => 'Vui lòng nhập tên phường/xã khi không chọn địa chỉ có sẵn.',
        'ward_name.string' => 'Tên phường/xã phải là chuỗi.',
        'ward_name.max' => 'Tên phường/xã không được vượt quá 255 ký tự.',

        'district_name.required_without' => 'Vui lòng nhập tên quận/huyện khi không chọn địa chỉ có sẵn.',
        'district_name.string' => 'Tên quận/huyện phải là chuỗi.',
        'district_name.max' => 'Tên quận/huyện không được vượt quá 255 ký tự.',

        'province_name.required_without' => 'Vui lòng nhập tên tỉnh/thành phố khi không chọn địa chỉ có sẵn.',
        'province_name.string' => 'Tên tỉnh/thành phố phải là chuỗi.',
        'province_name.max' => 'Tên tỉnh/thành phố không được vượt quá 255 ký tự.',

        'payment_method.required' => 'Vui lòng chọn phương thức thanh toán.',
        'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',

        'shipping_id.exists' => 'Phương thức giao hàng không hợp lệ.',

        'recipient_name.required_without' => 'Vui lòng nhập tên người nhận khi không chọn địa chỉ có sẵn.',
        'recipient_name.string' => 'Tên người nhận phải là chuỗi.',
        'recipient_name.max' => 'Tên người nhận không được vượt quá 255 ký tự.',

        'recipient_phone.required_without' => 'Vui lòng nhập số điện thoại người nhận khi không chọn địa chỉ có sẵn.',
        'recipient_phone.string' => 'Số điện thoại người nhận phải là chuỗi.',
        'recipient_phone.max' => 'Số điện thoại người nhận không được vượt quá 20 ký tự.',

        'recipient_email.required_without' => 'Vui lòng nhập email người nhận khi không chọn địa chỉ có sẵn.',
        'recipient_email.email' => 'Email người nhận không hợp lệ.',
        'recipient_email.max' => 'Email người nhận không được vượt quá 255 ký tự.',
    ];
}


    public function authorize()
    {
        return true;
    }
}
