<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponseTrait;


class UpdateOrderStatusRequest extends FormRequest
{
    use ApiResponseTrait;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_status'   => 'required|in:pending,confirming,confirmed,preparing,shipping,delivered,completed,canceled,failed,returned,return_requested,return_accepted,return_rejected,refunded',
            'payment_status' => 'nullable|in:unpaid,paid,refunded,failed,waiting_for_refund',
            'cancel_reason'  => 'required_if:order_status,canceled|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'order_status.required'   => 'Trạng thái đơn hàng là bắt buộc.',
            'order_status.in'         => 'Trạng thái đơn hàng không hợp lệ.',
            'payment_status.in'       => 'Trạng thái thanh toán không hợp lệ.',
            'cancel_reason.required_if' => 'Lý do hủy bắt buộc khi trạng thái là đã hủy.',
            'cancel_reason.string'    => 'Lý do hủy phải là chuỗi.',
        ];
    }

    /** DÙNG STATIC NHẤT QUÁN */
    public static $validTransitions = [
        'pending'          => ['confirmed', 'canceled'],
        'confirmed'        => ['preparing', 'canceled'],
        'preparing'        => ['shipping', 'canceled'],
        'shipping'         => ['delivered', 'failed', 'canceled'],
        'delivered'        => ['completed'],
        'failed'           => ['returned', 'canceled'],
        'returned'         => ['canceled', 'refunded'],
        'return_requested' => ['return_accepted', 'return_rejected'],
        'return_accepted'  => ['refunded', 'canceled', 'return_rejected'],
        'return_rejected'  => ['canceled', 'completed'],
        'refunded'         => [],
        'completed'        => [],
        'canceled'         => [],
    ];

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $orderId = $this->route('id');
            $order   = $orderId ? \App\Models\Order::find($orderId) : null;

            if (!$order) {
                $validator->errors()->add('order', 'Không tìm thấy đơn hàng.');
                return;
            }

            // Chuẩn hóa để tránh lệch khoảng trắng/hoa-thường
            $currentStatus = trim(strtolower((string)$order->order_status));
            $newStatus     = trim(strtolower((string)$this->input('order_status')));

            \Log::info('DEBUG Order Status', [
                'current' => $currentStatus,
                'new'     => $newStatus,
                'allowed' => self::$validTransitions[$currentStatus] ?? []
            ]);

            // Kiểm tra transition hợp lệ (STATIC)
            if (!in_array($newStatus, self::$validTransitions[$currentStatus] ?? [])) {
                $validator->errors()->add(
                    'order_status',
                    "Không thể chuyển trạng thái từ \"{$currentStatus}\" sang \"{$newStatus}\"."
                );
            }

            // Nếu đơn đã paid mà set canceled -> báo lỗi
            // Nếu đơn đã paid mà set canceled -> báo lỗi
            if ($newStatus === 'canceled' && $order->payment_status === 'paid') {
                // Thêm lỗi vào validator
                $validator->errors()->add('payment_status', 'Không thể hủy đơn hàng đã thanh toán.');

                // Ném exception trả về JSON 422
                throw new \Illuminate\Http\Exceptions\HttpResponseException(
                    response()->json([
                        'status' => false,
                        'message' => 'Không thể hủy đơn hàng đã thanh toán.',
                        'errors' => $validator->errors(),
                    ], 422)
                );
            }

        });
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'status'  => 'false',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
