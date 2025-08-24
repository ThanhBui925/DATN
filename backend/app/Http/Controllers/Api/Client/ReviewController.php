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
        'order_id'   => 'required|exists:shop_order,id', // thêm order_id
        'rating'     => 'required|integer|min:1|max:5',
        'comment'    => 'required|string|max:1000',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $userId = $request->user()->id;
    $productId = $request->product_id;
    $orderId   = $request->order_id;

    // Kiểm tra xem order_item này đã đánh giá chưa
    $alreadyReviewed = OrderItem::where('order_id', $orderId)
        ->where('product_id', $productId)
        ->where('is_review', 1)
        ->exists();

    if ($alreadyReviewed) {
        return response()->json([
            'message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi.'
        ], 403);
    }

    // Kiểm tra xem sản phẩm có thuộc đơn hàng của user và đơn đã hoàn tất
    $hasPurchased = Order::where('id', $orderId)
        ->where('user_id', $userId)
        ->whereIn('order_status', ['completed', 'delivered'])
        ->whereHas('orderItems', function ($q) use ($productId) {
            $q->where('product_id', $productId);
        })
        ->exists();

    if (!$hasPurchased) {
        return response()->json([
            'message' => 'Bạn chỉ có thể đánh giá sản phẩm đã mua trong đơn hàng này.'
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
        'product_id' => $productId,
        'user_id'    => $userId,
        'rating'     => $request->rating,
        'comment'    => $comment,
        'is_visible' => $isVisible,
    ]);

    // Cập nhật is_review cho đúng order_item
    OrderItem::where('order_id', $orderId)
        ->where('product_id', $productId)
        ->update(['is_review' => 1]);

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
