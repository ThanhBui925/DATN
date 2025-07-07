<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|lt:price|min:0',
            'sale_end' => 'nullable|date|after:now',
            'image' => 'nullable|file|image|max:2048',
            'status' => 'nullable|in:0,1',

            'variants' => 'required|array|min:1',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.size_id' => 'required|exists:sizes,id',
            'variants.*.color_id' => 'required|exists:colors,id',
            'variants.*.quantity' => 'required|integer|min:0',
            'variants.*.status' => 'nullable|in:0,1',
            'variants.*.images' => 'sometimes|array',
            'variants.*.images.*' => 'file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'name.string' => 'Tên sản phẩm phải là chuỗi.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',

            'category_id.required' => 'Danh mục là bắt buộc.',
            'category_id.exists' => 'Danh mục không tồn tại.',

            'price.required' => 'Giá sản phẩm là bắt buộc.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm không được âm.',

            'sale_price.numeric' => 'Giá khuyến mãi phải là số.',
            'sale_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá gốc.',
            'sale_price.min' => 'Giá khuyến mãi không được âm.',

            'sale_end.date' => 'Ngày kết thúc khuyến mãi phải là ngày hợp lệ.',
            'sale_end.after' => 'Ngày kết thúc phải sau thời điểm hiện tại.',

            'image.image' => 'Ảnh đại diện phải là hình ảnh.',
            'image.file' => 'Ảnh đại diện không hợp lệ.',
            'image.max' => 'Kích thước ảnh đại diện tối đa là 2MB.',

            'status.in' => 'Trạng thái không hợp lệ (chỉ 0 hoặc 1).',

            'variants.required' => 'Cần ít nhất một biến thể sản phẩm.',
            'variants.array' => 'Biến thể sản phẩm phải là mảng.',
            'variants.*.name.required' => 'Tên biến thể là bắt buộc.',
            'variants.*.name.string' => 'Tên biến thể phải là chuỗi.',
            'variants.*.name.max' => 'Tên biến thể không được vượt quá 255 ký tự.',

            'variants.*.size_id.required' => 'Kích cỡ là bắt buộc.',
            'variants.*.size_id.exists' => 'Kích cỡ không tồn tại.',

            'variants.*.color_id.required' => 'Màu sắc là bắt buộc.',
            'variants.*.color_id.exists' => 'Màu sắc không tồn tại.',

            'variants.*.quantity.required' => 'Số lượng là bắt buộc.',
            'variants.*.quantity.integer' => 'Số lượng phải là số nguyên.',
            'variants.*.quantity.min' => 'Số lượng không được âm.',

            'variants.*.status.in' => 'Trạng thái biến thể không hợp lệ.',

            'variants.*.images.array' => 'Danh sách ảnh phải là mảng.',
            'variants.*.images.*.file' => 'Ảnh biến thể phải là tệp.',
            'variants.*.images.*.image' => 'Ảnh biến thể phải là hình ảnh.',
            'variants.*.images.*.mimes' => 'Ảnh biến thể phải có định dạng jpeg, png, jpg hoặc gif.',
            'variants.*.images.*.max' => 'Ảnh biến thể tối đa 2MB.',
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
