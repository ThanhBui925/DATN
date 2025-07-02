<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Traits\ApiResponseTrait;

class CategoryController extends Controller
{
    use ApiResponseTrait;
    public function index(Request $request)
    {
        $categories = Category::query()->orderBy('id', 'desc')->get();
        return $this->success($categories);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        if (!$category) {
            return $this->error('Category not found', null, 404);
        }
        $products = $category->products()->with(['images'])->latest()->get();
        return $this->success($products);
    }
}
