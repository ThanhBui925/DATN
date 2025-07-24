<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class UpdateOrderStatusRequest extends FormRequest
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
            'order_status' => 'required|in:confirming,confirmed,preparing,shipping,delivered,completed,canceled,pending',
            'payment_status' => 'nullable|in:unpaid,paid',
            'cancel_reason' => 'required_if:order_status,canceled|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'order_status.required' => 'Trạng thái đơn hàng là bắt buộc.',
            'order_status.in' => 'Trạng thái đơn hàng không hợp lệ.',
            'payment_status.in' => 'Trạng thái thanh toán không hợp lệ.',
            'cancel_reason.required_if' => 'Lý do hủy bắt buộc khi trạng thái là đã hủy.',
            'cancel_reason.string' => 'Lý do hủy phải là chuỗi.',
        ];
    }

    protected $validTransitions = [
        'pending' => ['confirmed', 'canceled'],
        'confirmed' => ['preparing', 'canceled'],
        'preparing' => ['shipping', 'canceled'],
        'shipping' => ['delivered', 'canceled'],
        'delivered' => ['completed'],
        'completed' => [],
        'canceled' => [],
    ];

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $order = $this->route('id') 
                ? \App\Models\Order::find($this->route('id')) 
                : null;

            if (!$order) {
                $validator->errors()->add('order', 'Không tìm thấy đơn hàng.');
                return;
            }

            $currentStatus = $order->order_status;
            $newStatus = $this->input('order_status');

            if (!in_array($newStatus, $this->validTransitions[$currentStatus] ?? [])) {
                $validator->errors()->add('order_status', "Không thể chuyển trạng thái từ \"$currentStatus\" sang \"$newStatus\".");
            }

            if ($newStatus === 'canceled' && $this->input('payment_status') === 'paid') {
                $validator->errors()->add('payment_status', 'Không thể hủy đơn hàng đã thanh toán.');
            }
        });
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
