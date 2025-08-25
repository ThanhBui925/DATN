<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'content'     => 'required|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status'      => 'required|integer|in:0,1,2',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Vui lòng nhập tiêu đề.',
            'title.max'            => 'Tiêu đề tối đa 255 ký tự.',
            'description.required' => 'Vui lòng nhập mô tả.',
            'content.required'     => 'Vui lòng nhập nội dung.',
            'image.image'          => 'Tệp tải lên phải là hình ảnh.',
            'image.mimes'          => 'Chỉ chấp nhận jpg, jpeg, png, webp.',
            'image.max'            => 'Kích thước ảnh tối đa 2MB.',
            'status.required'      => 'Vui lòng chọn trạng thái.',
            'status.in'            => 'Trạng thái phải là 0, 1 hoặc 2.',
        ];
    }
}
