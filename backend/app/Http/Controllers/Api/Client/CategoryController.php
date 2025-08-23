<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Traits\ApiResponseTrait;
use App\Models\Color;
use App\Models\Size;

class CategoryController extends Controller
{
    use ApiResponseTrait;
    public function index(Request $request)
    {
        $categories = Category::query()
            ->where('status', 1)
            ->orderBy('id', 'desc')
            ->get();
        return $this->success($categories);
    }

    public function show(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $query = $category->products()
            ->with(['images', 'variants'])
            ->where('status', 1);

        $sort = $request->query('sort');

        $colors = $request->query('colors');
        $sizes = $request->query('sizes');
        $prices = $request->query('prices');


        if ($request->filled('colors')) {
            $colorNames = explode(',', $request->query('colors'));

            $colorIds = Color::whereIn('name', $colorNames)->pluck('id')->toArray();

            $query->whereHas('variants', function ($q) use ($colorIds) {
                $q->whereIn('color_id', $colorIds);
            });
        }

        if ($request->filled('sizes')) {
            $sizeNames = explode(',', $request->query('sizes'));

            $sizeIds = Size::whereIn('name', $sizeNames)->pluck('id')->toArray();

            $query->whereHas('variants', function ($q) use ($sizeIds) {
                $q->whereIn('size_id', $sizeIds);
            });
        }
        if ($prices) {
            $priceRange = explode(',', $prices);

            if (count($priceRange) === 2) {
                $minPrice = floatval($priceRange[0]);
                $maxPrice = floatval($priceRange[1]);

                $query->whereBetween('price', [$minPrice, $maxPrice]);
            }
        }

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
}
