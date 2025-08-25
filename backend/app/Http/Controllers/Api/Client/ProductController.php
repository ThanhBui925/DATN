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
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    use ApiResponseTrait;
    public function getAllProducts(Request $request)
    {
        $query = Product::query()
            ->with(['category', 'images', 'variants'])
            ->withAvg('reviews as rating', 'rating') // <-- thêm avg rating
            ->where('status', 1)
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->input('category_id'));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->input('search') . '%');
            });

        if ($request->filled('color_id')) {
            $colorIds = (array) $request->query('color_id');
            $query->whereHas('variants', fn($q) => $q->whereIn('color_id', $colorIds));
        }

        if ($request->filled('size_id')) {
            $sizeIds = (array) $request->query('size_id');
            $query->whereHas('variants', fn($q) => $q->whereIn('size_id', $sizeIds));
        }


        if ($request->filled('prices')) {
            $priceRange = explode(',', $request->query('prices'));
            if (count($priceRange) === 2) {
                $minPrice = floatval($priceRange[0]);
                $maxPrice = floatval($priceRange[1]);
                $query->whereHas('variants', fn($q) => $q->whereBetween('price', [$minPrice, $maxPrice]));
            }
        }

        $sort = $request->query('sort');
        switch ($sort) {
            case 'name_asc':  $query->orderBy('name', 'asc'); break;
            case 'name_desc': $query->orderBy('name', 'desc'); break;
            case 'price_asc': $query->orderBy('price', 'asc'); break;
            case 'price_desc': $query->orderBy('price', 'desc'); break;
            case 'rating_desc': $query->orderBy('rating', 'desc'); break; // <-- sort theo rating
            default: $query->latest();
        }

        $products = $query->get();

        // format rating
        $products->each(function ($p) {
            $p->rating = $p->rating ? round($p->rating, 1) : null;
        });

        return $this->success($products);
    }



        // New arrivals
    public function newArrivalProduct()
    {
        $products = Product::with(['category']) // load thêm category
            ->withAvg('reviews as rating', 'rating')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        $products->each(fn($p) => $p->rating = $p->rating ? round($p->rating, 1) : null);

        return $this->success($products);
    }

        // Best sellers
    public function bestSellerProduct()
    {
        $products = Product::with(['category']) // load thêm danh mục
            ->withCount('orderItems')
            ->withAvg('reviews as rating', 'rating')
            ->orderBy('order_items_count', 'desc')
            ->take(8)
            ->get();

        // Làm tròn rating
        $products->each(fn($p) => $p->rating = $p->rating ? round($p->rating, 1) : null);

        return $this->success($products);
    }

    // Sản phẩm có đánh giá cao nhất
    public function topRatedProduct()
    {
        $products = Product::with(['category']) // load thêm danh mục
            ->withAvg('reviews as rating', 'rating')
            ->withCount('reviews')
            ->having('reviews_count', '>', 0) // Chỉ lấy sản phẩm có
            ->orderBy('rating', 'desc')
            ->take(8)
            ->get();
        // Làm tròn rating
        $products->each(fn($p) => $p->rating = $p->rating ? round($p->rating, 1) : null);
        return $this->success($products);
    }
            




        // Featured products
    public function featureProduct()
    {
        $products = Product::withAvg('reviews as rating', 'rating')
            ->where('is_featured', true)
            ->take(8)
            ->get();

        $products->each(fn($p) => $p->rating = $p->rating ? round($p->rating, 1) : null);

        return $this->success($products);
    }





    public function show($id)
    {
        $product = Product::with([
            'category',
            'images',
            'reviews.user.customer', // load luôn customer kèm avatar
            'variants' => function ($q) {
                $q->where('status', 1)
                    ->with(['images', 'size', 'color']);
            },
        ])
        ->withCount([
            'orderItems as total_ordered_quantity' => function ($q) {
                $q->join('shop_order', 'shop_order.id', '=', 'shop_order_items.order_id')
                    ->whereIn('shop_order.order_status', ['completed', 'delivered'])
                    ->select(DB::raw("COALESCE(SUM(shop_order_items.quantity),0)"));
            },
            'reviews as review_count'
        ])
        ->selectSub(function($q) {
            $q->from('reviews')
                ->selectRaw('ROUND(AVG(rating), 1)')
                ->whereColumn('reviews.product_id', 'products.id');
        }, 'rating')
        ->findOrFail($id);


        return $this->success($product);
    }

    public function getRelatedProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $id)
            ->with('category:id,name') // Chỉ lấy id và name của danh mục
            ->withAvg('reviews as rating', 'rating')
            ->take(8)
            ->get();

        // Làm tròn rating
        $relatedProducts->each(fn($p) => $p->rating = $p->rating ? round($p->rating, 1) : null);

        return $this->success($relatedProducts);
    }





    public function getReviewsByProduct($id)
    {
        $reviews = Review::where('product_id', $id)
            ->with('user', 'user.customer')
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
