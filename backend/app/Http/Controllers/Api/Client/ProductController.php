<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Traits\ApiResponseTrait;

class ProductController extends Controller
{
    use ApiResponseTrait;
    public function getAllProducts(Request $request)
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->when($request->has('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->input('category_id'));
            })
            ->when($request->has('search'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->input('search') . '%');
            })
            ->latest()
            ->get();
        return $this->success($products);
    }

    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->latest()
            ->limit(10)
            ->get();
        return $this->success($products);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'reviews.user', 'variants','variants.images'])
            ->findOrFail($id);
        return $this->success($product);
    }
    
}
