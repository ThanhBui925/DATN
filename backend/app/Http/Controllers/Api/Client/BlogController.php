<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class BlogController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Blog::query()->where('status', 1);
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }
        $blogs = $query->orderBy('created_at', 'desc')->paginate(10);
        return $this->successResponse($blogs, 'Lấy danh sách blog thành công');
    }

    public function show($id)
    {
        $blog = Blog::where('id', $id)->where('status', 1)->first();
        if (!$blog) {
            return $this->errorResponse('Bài viết không tồn tại hoặc đã bị ẩn', null, 404);
        }
        return $this->successResponse($blog, 'Lấy chi tiết blog thành công');
    }

}