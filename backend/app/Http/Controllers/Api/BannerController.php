<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        $currentUser = auth('sanctum')->user();
        // if (!$currentUser || $currentUser->role !== 'admin') {
        //     return response()->json([
        //         'message' => 'Bạn không có quyền thực hiện chức năng này',
        //         'data' => []
        //     ], 403);
        // }
        $banners = Banner::orderBy('created_at', 'asc')->get();
        return response()->json([
            'message' => 'Danh Sách Banner Của Bạn',
            'data' => $banners
        ]);
    }


    public function show($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                'message' => 'Banner không tìm thấy',
            ], 404);
        }

        return response()->json([
            'message' => 'Lấy banner thành công',
            'data' => $banner,
        ]);
    }

    public function store(Request $request)
    {
        $currentUser = auth('sanctum')->user();
        // if (!$currentUser || $currentUser->role !== 'admin') {
        //     return response()->json([
        //         'message' => 'Bạn không có quyền thực hiện chức năng này',
        //         'data' => []
        //     ], 403);
        // }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'description' => 'nullable|string',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:0,1',
        ]);

        // Nếu có upload ảnh, lưu vào thư mục 'banners'
        if ($request->hasFile('image_url')) {
            $path = $request->file('image_url')->store('banners', 'public'); // Lưu file
            $imageUrl = Storage::url($path); // Lấy đường dẫn công khai
            $validatedData['image_url'] = env('APP_URL', 'http://127.0.0.1:8000') . $imageUrl; // Ghép thành URL đầy đủ
        }


        // Tạo banner mới với dữ liệu đã validate
        $banner = Banner::create($validatedData);

        return response()->json([
            'message' => 'Banner created successfully',
            'data' => $banner
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $currentUser = auth('sanctum')->user();
        // if (!$currentUser || $currentUser->role !== 'admin') {
        //     return response()->json([
        //         'message' => 'Bạn không có quyền thực hiện chức năng này',
        //         'data' => []
        //     ], 403);
        // }

        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json([
                'message' => 'Banner không tìm thấy'
            ], 404);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'description' => 'nullable|string',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:0,1',
        ]);

        if ($request->hasFile('image_url')) {
        // Nếu có ảnh cũ, xóa
            if (isset($banner) && $banner->image_url) {
                $oldPath = str_replace(url('/storage'), '', $banner->image_url); // /banners/abc.jpg
                Storage::disk('public')->delete($oldPath); // Xóa file cũ nếu tồn tại
            }

            // Lưu ảnh mới
            $path = $request->file('image_url')->store('banners', 'public');
            $validatedData['image_url'] = url(Storage::url($path)); // => http://127.0.0.1:8000/storage/banners/abc.jpg
        }

        $banner->update($validatedData);

        return response()->json([
            'message' => 'Banner cập nhật thành công',
            'data' => $banner
        ], 200);
    }


    public function destroy($id)
    {
        $currentUser = auth('sanctum')->user();
        // if (!$currentUser || $currentUser->role !== 'admin') {
        //     return response()->json([
        //         'message' => 'Bạn không có quyền thực hiện chức năng này',
        //         'data' => []
        //     ], 403);
        // }

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
