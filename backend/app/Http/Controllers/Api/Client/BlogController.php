<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class BlogController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lấy danh sách blog (có phân trang)
     */
    public function index(Request $request)
    {
        $query = Blog::query()->where('status', 1);
        // Tìm kiếm theo tiêu đề nếu có
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }
        $blogs = $query->orderBy('created_at', 'desc')->paginate(10);
        return $this->successResponse($blogs, 'Lấy danh sách blog thành công');
    }


    public function show($id)
    {
        $blog = Blog::query()
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->find($id);

        if (!$blog) {
            return response()->json([
                'message' => 'Bài viết không tồn tại hoặc đã bị ẩn'
            ], 404);
        }

        $imageUrl = $blog->image
            ? asset('storage/' . ltrim($blog->image, '/'))
            : null;

        return response()->json([
            'id'          => $blog->id,
            'title'       => $blog->title,
            'description' => $blog->description,
            'content'     => $blog->content,
            'image'       => $blog->image,
            'image_url'   => $imageUrl,
            'status'      => $blog->status,
            'created_at'  => optional($blog->created_at)->toDateTimeString(),
            'updated_at'  => optional($blog->updated_at)->toDateTimeString(),
        ]);
    }
}
