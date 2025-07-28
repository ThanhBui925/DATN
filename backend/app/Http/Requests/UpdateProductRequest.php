<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;

class UpdateProductRequest extends FormRequest
{
    use ApiResponseTrait;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|lt:price|min:0',
            'sale_end' => 'nullable|date|after:now',
            'image' => 'nullable|file|image|max:2048',
            'status' => 'nullable|in:0,1',

            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants.*.size_id,variants.*.color_id|string|max:255',
            'variants.*.size_id' => 'nullable|exists:sizes,id',
            'variants.*.color_id' => 'nullable|exists:colors,id',
            'variants.*.quantity' => 'nullable|integer|min:0',
            'variants.*.status' => 'nullable|in:0,1',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Tên sản phẩm phải là chuỗi.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',

            'category_id.exists' => 'Danh mục không tồn tại.',

            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm không được âm.',

            'sale_price.numeric' => 'Giá khuyến mãi phải là số.',
            'sale_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá gốc.',
            'sale_price.min' => 'Giá khuyến mãi không được âm.',

            'sale_end.date' => 'Ngày kết thúc khuyến mãi phải là ngày hợp lệ.',
            'sale_end.after' => 'Ngày kết thúc phải sau thời điểm hiện tại.',

            'image.file' => 'Ảnh phải là tệp tin.',
            'image.image' => 'Ảnh phải là hình ảnh.',
            'image.max' => 'Kích thước ảnh tối đa là 2MB.',

            'status.in' => 'Trạng thái không hợp lệ (chỉ 0 hoặc 1).',

            'variants.array' => 'Biến thể sản phẩm phải là mảng.',
            'variants.*.name.required_with' => 'Tên biến thể là bắt buộc nếu có size hoặc màu.',
            'variants.*.name.string' => 'Tên biến thể phải là chuỗi.',
            'variants.*.name.max' => 'Tên biến thể không được vượt quá 255 ký tự.',

            'variants.*.size_id.exists' => 'Kích cỡ không tồn tại.',
            'variants.*.color_id.exists' => 'Màu sắc không tồn tại.',

            'variants.*.quantity.integer' => 'Số lượng phải là số nguyên.',
            'variants.*.quantity.min' => 'Số lượng không được âm.',

            'variants.*.status.in' => 'Trạng thái biến thể không hợp lệ.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $variants = $this->input('variants', []);
            $productName = $this->input('name');

            // 1. Check trùng tên biến thể trong request
            $names = collect($variants)->pluck('name');
            if ($names->duplicates()->isNotEmpty()) {
                throw new HttpResponseException(response()->json([
                    'status' => false,
                    'message' => 'Tên các biến thể không được trùng nhau.',
                    'errors' => 422,
                ], 422));
            }

            // 2. Check biến thể đã tồn tại trong DB với size + color + product
            $existingProduct = \DB::table('products')
                ->where('name', $productName)
                ->first();

            if ($existingProduct) {
                $productId = $existingProduct->id;

                foreach ($variants as $variant) {
                    $exists = \DB::table('variant_products')
                        ->where('product_id', $productId)
                        ->where('size_id', $variant['size_id'])
                        ->where('color_id', $variant['color_id'])
                        ->exists();

                    if ($exists) {
                        throw new HttpResponseException(response()->json([
                            'status' => false,
                            'message' => 'Một hoặc nhiều biến thể với cùng kích cỡ và màu sắc đã tồn tại.',
                            'errors' => 422,
                        ], 422));
                    }
                }
            }
        });
    }


}
