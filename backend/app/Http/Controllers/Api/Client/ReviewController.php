<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponseTrait;

class ReviewController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lấy danh sách review theo sản phẩm
     * GET /api/client/reviews?product_id=ID
     */
    public function index(Request $request)
    {
        $query = Review::with(['user'])
            ->where('is_visible', 1);

        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        $reviews = $query->latest()->get();

        return $this->success($reviews, 'Lấy danh sách đánh giá thành công');
    }

    /**
     * Gửi đánh giá sản phẩm
     * POST /api/client/reviews
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors(), 422);
        }

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id' => $request->user()->id,
            'comment' => $request->comment,
            'rating' => $request->rating,
            'is_visible' => 1,
        ]);

        return $this->success($review->load(['user']), 'Đánh giá sản phẩm thành công', 201);
    }
}
