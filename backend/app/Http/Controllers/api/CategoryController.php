<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->filled('name_like')) {
            $query->where('name', 'like', '%' . trim($request->name_like) . '%');
        } elseif ($request->filled('name')) {
            $query->where('name', 'like', '%' . trim($request->name) . '%');
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
    
        $productCount = Product::where('category_id', $id)->count();
    
        $orderCount = DB::table('shop_order_items')
            ->join('products', 'shop_order_items.product_id', '=', 'products.id')
            ->where('products.category_id', $id)
            ->distinct('shop_order_items.order_id')
            ->count('shop_order_items.order_id');
    
        $categoryArray = $category->toArray();
        $categoryArray['product_count'] = $productCount;
        $categoryArray['order_count'] = $orderCount;
    
        return $this->success($categoryArray);
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

        // Lấy dữ liệu thô từ request để debug
        Log::info('Raw request data: ', $request->all());

        // Lấy dữ liệu đã qua validation (có thể rỗng nếu không gửi trường nào)
        $validatedData = $request->validated();

        // Tạo mảng dữ liệu để cập nhật, ban đầu là dữ liệu cũ
        $data = $category->toArray();

        // Ghi đè các trường có trong validated data
        if (!empty($validatedData)) {
            foreach ($validatedData as $key => $value) {
                if ($key === 'status' && $value !== null) {
                    $data[$key] = (int) $value; // Chuyển status thành integer (0 hoặc 1) phù hợp với tinyint
                } else {
                    $data[$key] = $value;
                }
            }
        }

        // Xử lý file image
        $imageUrl = $request->hasFile('image')
            ? Storage::url($request->file('image')->store('categories', 'public'))
            : null;

        if ($imageUrl) {
            Log::info('File received: ' . $request->file('image')->getClientOriginalName());
            Log::info('File size: ' . $request->file('image')->getSize() . ' bytes');
            Log::info('File mime type: ' . $request->file('image')->getMimeType());
            if ($request->file('image')->isValid()) {
                $data['image'] = env('APP_URL', "http://127.0.0.1:8000") . $imageUrl;
                Log::info('New image path: ' . $data['image']);

                if (!empty($category->image)) {
                    $oldImagePath = str_replace(env('APP_URL', "http://127.0.0.1:8000") . '/storage/', '', $category->image);
                    if (Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
            } else {
                Log::error('Invalid file uploaded');
                $data['image'] = $category->image; // Giữ ảnh cũ nếu file không hợp lệ
            }
        }

        // Log dữ liệu trước khi update
        Log::info('Data to update: ', $data);

        // Cập nhật
        $category->update($data);
        $category->refresh();

        // Log dữ liệu sau khi update
        Log::info('Updated category: ', $category->toArray());

        return $this->success($category, 'Category updated successfully');
    } catch (\Exception $e) {
        Log::error('Update failed: ' . $e->getMessage());
        return $this->error('Server error', $e->getMessage(), 500);
    }
}



    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->products()->exists()) {
            return $this->error('Không thể xóa danh mục này vì đã tồn tại sản phẩm trong danh mục ! ', null, 400);
        }
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

    public function getCategoryActive(Request $request)
    {
        $categories = Category::query()
            ->where('status', 1)
            ->orderBy('id', 'desc')
            ->get();
        return $this->success($categories);
    }

}
