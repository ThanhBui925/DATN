<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['product', 'user'])->where('is_visible', 1);

        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        $reviews = $query->get();

        return response()->json([
            'message' => 'Reviews retrieved successfully',
            'data' => $reviews,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'rating' => $request->rating,
            'is_visible' => 1,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'data' => $review->load(['product', 'user']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'is_visible' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $review->update([
            'is_visible' => $request->is_visible,
        ]);

        return response()->json([
            'message' => 'Review updated successfully',
            'data' => $review->load(['product', 'user']),
        ], 200);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ], 204);
    }

    public function reply(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'reply' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $review->update([
            'reply' => $request->reply,
        ]);

        return response()->json([
            'message' => 'Reply added successfully',
            'data' => $review->load(['product', 'user']),
        ], 200);
    }
}
