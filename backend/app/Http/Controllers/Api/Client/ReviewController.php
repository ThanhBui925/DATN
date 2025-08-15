<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use App\Models\OrderItem;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá công khai cho sản phẩm
     * GET /api/client/reviews?product_id=ID
     */
    public function index(Request $request)
    {
        $query = Review::with('user')
            ->where('is_visible', 1);

        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        $reviews = $query->latest()->get();

        return response()->json([
            'message' => 'Lấy danh sách đánh giá thành công',
            'data' => $reviews
        ]);
    }

    /**
     * Gửi đánh giá mới (chỉ khi đã mua hàng)
     * POST /api/client/reviews
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 🔐 Kiểm tra đã mua sản phẩm chưa
        $hasPurchased = Order::where('user_id', $request->user()->id)
            ->whereIn('order_status', ['completed', 'delivered']) // Đơn hoàn tất
            ->whereHas('orderItems', function ($q) use ($request) {
                $q->where('product_id', $request->product_id);
            })->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'Bạn chỉ có thể đánh giá sản phẩm đã mua.'
            ], 403);
        }

        // 🔍 Kiểm tra từ nhạy cảm
        $comment = $request->comment;
        $bannedWords = ['xấu', 'lừa đảo', 'rác', 'đồ tệ'];
        $isVisible = true;

        foreach ($bannedWords as $word) {
            if (stripos($comment, $word) !== false) {
                $isVisible = false;
                break;
            }
        }

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $comment,
            'is_visible' => $isVisible,
        ]);

        OrderItem::whereHas('order', function ($q) use ($request) {
            $q->where('user_id', $request->user()->id)
              ->whereIn('order_status', ['completed', 'delivered']);
        })
        ->where('product_id', $request->product_id)
        ->update(['is_review' => true]);

        return response()->json([
            'message' => $isVisible
                ? 'Gửi đánh giá thành công'
                : 'Gửi thành công, đánh giá đang chờ duyệt',
            'data' => $review->load('user'),
        ], 201);
    }

    /**
     * Sửa đánh giá của chính mình
     * PUT /api/client/reviews/{id}
     */
    public function update(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = $request->input('comment', $review->comment);
        $bannedWords = ['xấu', 'lừa đảo', 'rác', 'đồ tệ'];
        $isVisible = true;

        foreach ($bannedWords as $word) {
            if (stripos($comment, $word) !== false) {
                $isVisible = false;
                break;
            }
        }

        $review->update([
            'rating' => $request->input('rating', $review->rating),
            'comment' => $comment,
            'is_visible' => $isVisible,
        ]);

        return response()->json([
            'message' => $isVisible
                ? 'Cập nhật đánh giá thành công'
                : 'Đánh giá đã được cập nhật và đang chờ duyệt lại',
            'data' => $review->load('user'),
        ]);
    }

    /**
     * Xoá đánh giá của chính mình
     * DELETE /api/client/reviews/{id}
     */
    public function destroy(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $review->delete();

        return response()->json([
            'message' => 'Xoá đánh giá thành công',
        ], 204);
    }
}
