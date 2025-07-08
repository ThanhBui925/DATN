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

    /**
     * Xem chi tiết blog
     */
    public function show($id)
    {
        $blog = Blog::where('status', 1)->find($id);
        if (!$blog) {
            return $this->errorResponse('Bài viết không tồn tại hoặc đã bị ẩn', null, 404);
        }
        return $this->successResponse($blog, 'Lấy chi tiết blog thành công');
    }
} 