<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->filled('keyword')) {
            $query->where('name', 'like', '%' . $request->keyword . '%');
        }

        if ($request->filled('status')) {
            $query->whereRaw('LOWER(TRIM(status)) = ?', [strtolower(trim($request->status))]);
        }

        $categories = $query->orderBy('id', 'desc')->get();

        if ($categories->isEmpty()) {
            return $this->error('Không tìm thấy danh mục phù hợp.', null, 404);
        }

        return $this->success($categories);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return $this->success($category);
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $imageUrl = $request->hasFile('image')
                ? Storage::url($request->file('image')->store('categories', 'public'))
                : null;

            $category = Category::create([
                'name' => $request->name,
                'description' => $request->description,
                'image' => env('APP_URL', "http://127.0.0.1:8000") .  $imageUrl,
                'status' => $request->status ?? 'active',
            ]);

            return $this->success($category, 'Category created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Server error', $e->getMessage(), 500);
        }
    }

     public function update(UpdateCategoryRequest $request, $id)
    {
        try {
            $category = Category::findOrFail($id);

            $data = $request->all();

            if ($request->hasFile('image')) {
                $data['image'] = Storage::url($request->file('image')->store('categories', 'public'));

                if (!empty($category->image)) {
                    $oldImagePath = str_replace('/storage/', '', $category->image);
                    if (Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
            } else {
                $data['image'] = $category->image;
            }

            $category->update($data);

            return $this->success($category, 'Category updated successfully');
        } catch (\Exception $e) {
            return $this->error('Server error', $e->getMessage(), 500);
        }
    }




    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return $this->success(null, 'Category deleted successfully');
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();
        return $this->success($category, 'Category restored successfully');
    }

    public function forceDelete($id)
    {
        $category = Category::withTrashed()->findOrFail($id);

        if ($category->products()->exists()) {
            return $this->error('Không thể xóa vĩnh viễn vì vẫn còn sản phẩm thuộc danh mục này.', null, 400);
        }

        $category->forceDelete();
        return $this->success(null, 'Xóa vĩnh viễn danh mục thành công.');
    }

    public function trashed()
    {
        $trashed = Category::onlyTrashed()->get();

        if ($trashed->isEmpty()) {
            return $this->error('Không có danh mục nào đã bị xóa mềm.', null, 404);
        }

        return $this->success($trashed);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return $this->error('Missing search query', null, 400);
        }

        $categories = Category::where('name', 'LIKE', "%{$query}%")
            ->orWhere('slug', 'LIKE', "%{$query}%")
            ->get();

        return $this->success($categories);
    }

    public function paginate(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $categories = Category::paginate($perPage);
        return $this->success($categories);
    }
}
