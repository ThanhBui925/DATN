<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::withCount('comments')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('limit', 10));

        return response()->json([
            'message' => 'Danh sách bài viết',
            'data' => $blogs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required',
            'image' => 'required|image|max:2048',
            'status' => 'boolean'
        ]);

        $imagePath = $request->file('image')->store('blogs', 'public');

        $blog = Blog::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'image' => $imagePath,
            'status' => $request->status ?? 1
        ]);

        return response()->json(['message' => 'Thêm bài viết thành công', 'data' => $blog], 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required',
            'image' => 'image|max:2048',
            'status' => 'boolean'
        ]);

        $data = $request->only(['title', 'description', 'content', 'status']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $blog->update($data);

        return response()->json(['message' => 'Cập nhật bài viết thành công', 'data' => $blog]);
    }

    public function hide($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->update(['status' => 0]);

        return response()->json(['message' => 'Ẩn bài viết thành công']);
    }

    public function comments(Request $request, $blogId)
    {
        $blog = Blog::findOrFail($blogId);

        $comments = $blog->comments()
            ->whereNull('deleted_at')
            ->with('user')
            ->paginate($request->get('limit', 10));

        return response()->json([
            'message' => 'Danh sách bình luận',
            'data' => $comments
        ]);
    }

    public function storeComment(Request $request, $blogId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string'
        ]);

        $comment = Comment::create([
            'blog_id' => $blogId,
            'user_id' => $request->user_id,
            'content' => $request->content,
            'status' => 1
        ]);

        return response()->json(['message' => 'Thêm bình luận thành công', 'data' => $comment], 201);
    }

    public function softDeleteComment($commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $comment->delete(); // Soft delete

        return response()->json(['message' => 'Xóa mềm bình luận thành công']);
    }

    public function restoreComment($commentId)
    {
        $comment = Comment::withTrashed()->findOrFail($commentId);
        $comment->restore();
        return response()->json(['message' => 'Khôi phục bình luận thành công']);
    }

}
