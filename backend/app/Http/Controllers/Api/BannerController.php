<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        $currentUser = auth('sanctum')->user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này',
                'data' => []
            ], 403);
        }
        $banners = Banner::orderBy('created_at', 'asc')->get();
        return response()->json([
            'message' => 'Danh Sách Banner Của Bạn',
            'data' => $banners
        ]);
    }

    public function store(Request $request)
    {
        $currentUser = auth('sanctum')->user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này',
                'data' => []
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|string',
            'description' => 'nullable|string',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:active,inactive',
        ]);

        $slug = Str::slug($request->title) . '-' . Str::random(5);
        $banner = Banner::create(array_merge($request->all(), ['slug' => $slug]));

        return response()->json([
            'message' => 'Banner created successfully',
            'data' => $banner
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $currentUser = auth('sanctum')->user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này',
                'data' => []
            ], 403);
        }

        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json([
                'message' => 'Banner Không Tìm Thấy'
            ], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|string',
            'description' => 'nullable|string',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:active,inactive',
        ]);

        $slug = Str::slug($request->title) . '-' . Str::random(5);
        $banner->update(array_merge($request->all(), ['slug' => $slug]));

        return response()->json([
            'message' => 'Banner updated successfully',
            'data' => $banner
        ], 200);
    }

    public function destroy($id)
    {
        $currentUser = auth('sanctum')->user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này',
                'data' => []
            ], 403);
        }

        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json([
                'message' => 'Banner Không Tìm Thấy'
            ], 404);
        }
        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted successfully'
        ], 200);
    }
}
