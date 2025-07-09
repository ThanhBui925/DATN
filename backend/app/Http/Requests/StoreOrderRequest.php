<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules()
    {
        return [
            'shipping_address' => 'required|string|max:255',
            'payment_method'   => 'required|in:cash,card,paypal,vnpay',
            'shipping_id'      => 'nullable|exists:shipping,id',
            'recipient_name'   => 'required|string|max:255',
            'recipient_phone'  => 'required|string|max:20',
            'recipient_email'   => 'required|email|max:255',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
