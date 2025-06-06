<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'string|max:255', // Bỏ required
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|max:5012',
            'status' => 'in:0,1', // Bỏ required
        ];
    }
}
