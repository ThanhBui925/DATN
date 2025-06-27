<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255', // optional
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:5120',
            'status' => 'sometimes|in:0,1', // optional
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Tên danh mục phải là chuỗi.',
            'name.max' => 'Tên danh mục không được vượt quá 255 ký tự.',

            'description.string' => 'Mô tả phải là chuỗi.',

            'image.file' => 'Ảnh phải là tệp tin.',
            'image.image' => 'Ảnh phải là hình ảnh.',
            'image.mimes' => 'Ảnh phải có định dạng jpeg, png, jpg hoặc gif.',
            'image.max' => 'Kích thước ảnh tối đa là 5MB.',

            'status.in' => 'Trạng thái không hợp lệ (chỉ chấp nhận 0 hoặc 1).',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
