<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use App\Models\Voucher;
class UpdateVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        $voucherId = $this->route('id');
        $voucher   = Voucher::find($voucherId);

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vouchers', 'code')->ignore($voucherId)
            ],
            'discount_type' => ['required', Rule::in(['fixed', 'percentage'])],

            'discount' => [
                'required',
                'numeric',
                'min:0.01',
                Rule::when(
                    ($this->discount_type ?? $voucher->discount_type) === 'percentage',
                    'max:100'
                ),
                Rule::when(
                    ($this->discount_type ?? $voucher->discount_type) === 'fixed',
                    'max:1000000'
                ),
            ],

            'max_discount_amount'   => 'required|numeric|min:0',
            'min_order_amount'      => 'required|numeric|min:0',

            // thêm start_date
            'start_date' => 'required|date|before:expiry_date|different:expiry_date',

            // expiry_date phải sau start_date
            'expiry_date' => 'required|date|after:start_date|different:start_date',

            'usage_limit'           => 'nullable|integer|min:1',
            'usage_limit_per_user'  => 'nullable|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Mã giảm giá là bắt buộc.',
            'code.unique'   => 'Mã giảm giá đã tồn tại.',
            'code.max'      => 'Mã giảm giá không được vượt quá 50 ký tự.',

            'discount_type.required' => 'Loại giảm giá là bắt buộc.',
            'discount_type.in'       => 'Loại giảm giá không hợp lệ.',

            'discount.required' => 'Giá trị giảm là bắt buộc.',
            'discount.numeric'  => 'Giá trị giảm phải là số.',
            'discount.min'      => 'Giá trị giảm phải lớn hơn 0.',
            'discount.max'      => 'Phần trăm giảm không được vượt quá 100 hoặc số tiền giảm quá lớn.',

            'max_discount_amount.numeric' => 'Giá trị giảm tối đa phải là số.',
            'max_discount_amount.min'     => 'Giá trị giảm tối đa không được nhỏ hơn 0.',
            'max_discount_amount.required'=> 'Giá trị giảm tối đa là bắt buộc.',

            'min_order_amount.required' => 'Giá trị đơn hàng tối thiểu là bắt buộc.',
            'min_order_amount.numeric'  => 'Giá trị đơn hàng tối thiểu phải là số.',
            'min_order_amount.min'      => 'Đơn hàng tối thiểu không được âm.',

            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.date'     => 'Ngày bắt đầu phải đúng định dạng.',
            'start_date.before'   => 'Ngày bắt đầu phải trước ngày kết thúc.',
            'start_date.different'=> 'Ngày bắt đầu và ngày kết thúc không được trùng nhau.',

            'expiry_date.required'=> 'Ngày hết hạn là bắt buộc.',
            'expiry_date.date'    => 'Ngày hết hạn phải đúng định dạng.',
            'expiry_date.after'   => 'Ngày hết hạn phải sau ngày bắt đầu.',
            'expiry_date.different'=> 'Ngày hết hạn không được trùng với ngày bắt đầu.',

            'usage_limit.integer'          => 'Số lượt sử dụng phải là số nguyên.',
            'usage_limit.min'              => 'Số lượt sử dụng phải lớn hơn 0.',
            'usage_limit_per_user.integer' => 'Số lượt sử dụng mỗi người phải là số nguyên.',
            'usage_limit_per_user.min'     => 'Số lượt sử dụng mỗi người phải lớn hơn 0.',
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Cập nhật voucher thất bại !',
            'errors' => $validator->errors(),
        ], 422));
    }
}
