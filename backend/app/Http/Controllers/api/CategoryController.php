<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }
    public function show($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        return response()->json([
            'status' => true,
            'data' => $category
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $validated = $request->validate([
            'slug' => 'required|unique:categories,slug|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'in:active,inactive'
        ]);

        // 2. Tạo category mới với dữ liệu đã validate
        $category = Category::create([
            'slug' => $validated['slug'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        // 3. Trả về kết quả
        return response()->json([
            'status' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // 1. Tìm category theo slug, nếu không tìm thấy sẽ báo lỗi 404
        $category = Category::where('slug', $id)->firstOrFail();

        // 2. Validate dữ liệu gửi lên (có thể cập nhật 1 số trường)
        $validated = $request->validate([
            'slug' => "sometimes|required|unique:categories,slug,{$category->id}|max:255",
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'in:active,inactive'
        ]);

        // 3. Cập nhật dữ liệu
        $category->update($validated);

        // 4. Trả về kết quả
        return response()->json([
            'status' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function destroy($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    public function restore($slug)
    {
        $category = Category::withTrashed()->where('slug', $slug)->firstOrFail();
        $category->restore();

        return response()->json([
            'status' => true,
            'message' => 'Category restored successfully',
            'data' => $category
        ]);
    }

    public function forceDelete($slug)
    {
        $category = Category::withTrashed()->where('slug', $slug)->firstOrFail();

        // Kiểm tra xem danh mục có sản phẩm không
        if ($category->products()->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa vĩnh viễn vì vẫn còn sản phẩm thuộc danh mục này.'
            ], 400);
        }

        // Xóa vĩnh viễn nếu không còn sản phẩm liên quan
        $category->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa vĩnh viễn danh mục thành công.'
        ]);
    }


    public function trashed()
    {
        $trashedCategories = Category::onlyTrashed()->get();

        if ($trashedCategories->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không có danh mục nào đã bị xóa mềm.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $trashedCategories
        ]);
    }


    public function search(Request $request)
    {
        $query = $request->input('query');

        // Nếu không có query thì trả về lỗi luôn
        if (!$query) {
            return response()->json([
                'status' => false,
                'message' => 'Missing search query'
            ], 400);
        }

        // Tìm kiếm
        $categories = Category::where('name', 'LIKE', "%{$query}%")
            ->orWhere('slug', 'LIKE', "%{$query}%")
            ->get();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }


    public function paginate(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $categories = Category::paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }

}
