<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;
use App\Models\VariantProduct;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;



class UpdateProductRequest extends FormRequest
{
    use ApiResponseTrait;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('product');
        Log::info('Product ID being updated: ' . $id);
        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('products', 'name')->ignore($id),
            ],
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
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
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
        'status'  => false,
        'message' => 'Cập nhật sản phẩm thất bại !',
        'errors'  => $validator->errors()->toArray(),
    ], 422));
}

public function withValidator($validator)
{
    $validator->after(function ($validator) {
        $variants = $this->input('variants', []);
        $productId = $this->route('id');

        // 1. Check duplicate names
        $names = collect($variants)->pluck('name');
        if ($names->duplicates()->isNotEmpty()) {
            throw new HttpResponseException(response()->json([
                'status'  => false,
                'message' => 'Tên các biến thể không được trùng nhau.',
                'errors'  => ['variants' => ['Tên các biến thể không được trùng nhau.']],
            ], 422));
        }

        // 2. Check duplicate size+color
        $combinations = [];
        foreach ($variants as $variant) {
            $sizeId = $variant['size_id'] ?? null;
            $colorId = $variant['color_id'] ?? null;
            $variantId = $variant['id'] ?? null;

            if (!$sizeId || !$colorId) {
                continue;
            }

            $key = $sizeId . '-' . $colorId;
            if (in_array($key, $combinations)) {
                throw new HttpResponseException(response()->json([
                    'status'  => false,
                    'message' => 'Một hoặc nhiều biến thể với cùng kích cỡ và màu sắc trùng nhau.',
                    'errors'  => ['variants' => ['Màu sắc và kích cỡ không được trùng nhau.']],
                ], 422));
            }
            $combinations[] = $key;

            // Check DB
            $query = \App\Models\VariantProduct::where('product_id', $productId)
                ->where('size_id', $sizeId)
                ->where('color_id', $colorId);

            if ($variantId) {
                $query->where('id', '!=', $variantId);
            }

            if ($query->exists()) {
                throw new HttpResponseException(response()->json([
                    'status'  => false,
                    'message' => 'Một hoặc nhiều biến thể với cùng kích cỡ và màu sắc đã tồn tại.',
                    'errors'  => ['variants' => ['Màu sắc và kích cỡ đã tồn tại.']],
                ], 422));
            }
        }
    });
}







}
