<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Traits\ApiResponseTrait;
use App\Models\Category;
use App\Models\Color;
use App\Models\Size;
use App\Models\Review;

class ProductController extends Controller
{
    use ApiResponseTrait;
    public function getAllProducts(Request $request)
    {
        $query = Product::query()
            ->with(['category', 'images', 'variants'])
            ->where('status', 1)
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->input('category_id'));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->input('search') . '%');
            });

        if ($request->filled('colors')) {
            $colorIds = explode(',', $request->query('colors'));

            $query->whereHas('variants', function ($q) use ($colorIds) {
                $q->whereIn('color_id', $colorIds);
            });
        }

        if ($request->filled('sizes')) {
            $sizeIds = explode(',', $request->query('sizes'));

            $query->whereHas('variants', function ($q) use ($sizeIds) {
                $q->whereIn('size_id', $sizeIds);
            });
        }


        if ($request->filled('prices')) {
            $priceRange = explode(',', $request->query('prices'));

            if (count($priceRange) === 2) {
                $minPrice = floatval($priceRange[0]);
                $maxPrice = floatval($priceRange[1]);

                $query->whereHas('variants', function ($q) use ($minPrice, $maxPrice) {
                    $q->whereBetween('price', [$minPrice, $maxPrice]);
                });
            }
        }

        $sort = $request->query('sort');
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating_desc':
                $query->orderBy('rating', 'desc');
                break;
            case 'color_asc':
                $query->orderBy('color', 'asc');
                break;
            case 'color_desc':
                $query->orderBy('color', 'desc');
                break;
            default:
                $query->latest();
        }


        $products = $query->latest()->get();


        return $this->success($products);
    }


    // New arrivals
    public function newArrivalProduct()
    {
        return Product::orderBy('created_at', 'desc')->take(8)->get();
    }

    // Best sellers
    public function bestSellerProduct()
    {
        return Product::withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->take(8)
            ->get();
    }

    // Featured products
    public function featureProduct()
    {
        return Product::where('is_featured', true)->take(8)->get();
    }




    public function show($id)
    {
        $product = Product::with(['category', 'images', 'reviews.user', 'variants','variants.images'])
            ->findOrFail($id);
        return $this->success($product); 
    }

    public function getReviewsByProduct($id)
    {
        $reviews = Review::where('product_id', $id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->successResponse($reviews, 'Lấy danh sách đánh giá thành công');
    }

    public function getAllSize()
    {
        $sizes = Size::select('id', 'name')->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách size',
            'data' => $sizes
        ]);
    }

    public function getAllColor()
    {
        $colors = Color::select('id', 'name')->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách màu sắc',
            'data' => $colors
        ]);
    }

    

    
}
