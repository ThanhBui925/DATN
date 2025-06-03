<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::orderBy('id', 'desc')->get();
        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }
    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $category
        ]);
    }


    public function store(Request $request)
{
    try {
        $messages = [
            'name.unique' => 'Danh mục đã tồn tại',
            'name.required' => 'Tên danh mục là bắt buộc',
            'name.max' => 'Tên danh mục không được vượt quá 255 ký tự',
            'image.image' => 'File phải là hình ảnh hợp lệ',
            'image.mimes' => 'Ảnh phải có định dạng jpeg, png, jpg, gif',
            'image.max' => 'Ảnh không được lớn hơn 5MB',
            'status.in' => 'Trạng thái không hợp lệ',
        ];

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'status' => 'nullable|in:active,inactive',
        ], $messages);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            $imageUrl = \Illuminate\Support\Facades\Storage::url($imagePath);
        } else {
            $imageUrl = null;
        }

        $category = \App\Models\Category::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image' => $imageUrl,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status' => false,
            'message' => 'Category already exists',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Server error',
            'error' => $e->getMessage(),
        ], 500);
    }
}









    public function update(Request $request, $id)
    {
        // 1. Tìm category theo id
        $category = Category::findOrFail($id);

        // 2. Validate dữ liệu gửi lên
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|max:2048',
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

    public function destroy($id)
    {
        $category = Category::where('id', $id)->firstOrFail();
        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();

        return response()->json([
            'status' => true,
            'message' => 'Category restored successfully',
            'data' => $category
        ]);
    }


    public function forceDelete($id)
    {
        $category = Category::withTrashed()->findOrFail($id);

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
