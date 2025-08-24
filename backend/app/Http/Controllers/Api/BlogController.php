<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Requests\Blog\StoreBlogRequest;
use App\Http\Requests\Blog\UpdateBlogRequest;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::orderBy('created_at', 'desc')->get();

        return response()->json(
            $blogs->map(function ($blog) {
                return [
                    'id'          => (string) $blog->id,
                    'title'       => $blog->title,
                    'description' => $blog->description,
                    'content'     => $blog->content,
                    'image'       => $blog->image ? asset('storage/' . $blog->image) : null,
                    'status'      => (int) $blog->status,
                    'deleted_at'  => $blog->deleted_at,
                    'created_at'  => optional($blog->created_at)->format('Y-m-d H:i:s'),
                    'updated_at'  => optional($blog->updated_at)->format('Y-m-d H:i:s'),
                ];
            })
        );
    }


    public function store(StoreBlogRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $blog = Blog::create($data);

        return response()->json([
            'message' => 'Thêm bài viết thành công',
            'data'    => $blog,
        ], 201);
    }


    public function show($id)
    {
        $blog = Blog::findOrFail($id);

        return response()->json([
            'id'          => (string) $blog->id,
            'title'       => $blog->title,
            'description' => $blog->description,
            'content'     => $blog->content,
            'image'       => $blog->image ? asset('storage/' . $blog->image) : null,
            'status'      => $blog->status,
            'deleted_at'  => $blog->deleted_at,
            'created_at'  => optional($blog->created_at)->format('Y-m-d H:i:s'),
            'updated_at'  => optional($blog->updated_at)->format('Y-m-d H:i:s'),
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete(); // Soft delete

        return response()->json(['message' => 'Xóa bài viết thành công']);
    }


    public function update(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        } else {
            $data['image'] = $blog->image;
        }

        $blog->update($data);

        return response()->json([
            'message' => 'Cập nhật bài viết thành công',
            'data'    => $blog
        ]);
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
