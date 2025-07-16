<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules()
{
    return [
        'address_id'       => 'nullable|exists:addresses,id',
        'shipping_address' => 'required_without:address_id|string|max:255',
        'payment_method'   => 'required|in:cash,card,paypal,vnpay',
        'shipping_id'      => 'nullable|exists:shipping,id',
        'recipient_name'  => 'required_without:address_id|nullable|string|max:255',
        'recipient_phone' => 'required_without:address_id|nullable|string|max:20',
        'recipient_email' => 'required_without:address_id|nullable|email|max:255',
    ];
}

    public function authorize()
    {
        return true;
    }
}
