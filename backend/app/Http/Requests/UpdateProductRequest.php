<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
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
            'variants.*.images.*' => 'file|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];
    }
}
