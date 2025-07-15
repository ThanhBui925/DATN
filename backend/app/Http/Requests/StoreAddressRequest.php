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
            'is_default' => 'nullable|in:1,0,true,false',
        ];
    }
}
