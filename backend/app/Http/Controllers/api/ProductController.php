<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\VariantImage;
use App\Models\VariantProduct;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Image;
use Illuminate\Support\Str;
use App\Models\OrderItem;
use App\Models\Review;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Product::with([
            'category',
            'variants.size',
            'variants.color',
            'variants.images'
        ])->withSum('variants', 'quantity');


        // Tìm theo tên (LIKE)
        if ($request->filled('name_like')) {
            $query->where('name', 'like', '%' . trim($request->name_like) . '%');
        } elseif ($request->filled('name')) {
            $query->where('name', 'like', '%' . trim($request->name) . '%');
        }

        // Tìm theo trạng thái (0 hoặc 1)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Tìm theo nhiều danh mục
        if ($request->has('category_id')) {
            $categoryIds = is_array($request->category_id)
                ? $request->category_id
                : [$request->category_id];

            $query->whereIn('category_id', $categoryIds);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return $this->successResponse($products);
    }
    
    public function show($id)
    {
        $product = Product::with([
            'category',
            'variants.size',
            'variants.color',
            'variants.images',
            'images',
            'reviews.user'
        ])->find($id);
    
        if (!$product) {
            return $this->errorResponse('Sản phẩm không tồn tại', 404);
        }
    
        // Tổng số lượng đơn hàng
        $orderQuantity = OrderItem::where('product_id', $id)->sum('quantity');
        $product->total_ordered_quantity = $orderQuantity;
    
        // Tính điểm đánh giá trung bình và tổng số đánh giá
        $averageRating = $product->reviews()->avg('rating');
        $reviewCount = $product->reviews()->count();
    
        $product->average_rating = round($averageRating, 1); // làm tròn 1 chữ số
        $product->review_count = $reviewCount;
    
        return $this->successResponse($product);
    }
    



    public function store(StoreProductRequest $request)
    {
        DB::beginTransaction();

        try {
            // Prepare product data
            $productData = [
                'name' => $request->input('name', ''),
                'category_id' => $request->input('category_id', ''),
                'description' => $request->input('description', ''),
                'price' => $request->input('price', '0.00'),
                'sale_price' => $request->input('sale_price', ''),
                'sale_end' => $request->input('sale_end', null),
                'status' => $request->input('status', '1'),
            ];

            // Handle product image upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $productData['image'] = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);
            }

            // Create product
            $product = Product::create($productData);

            if ($request->hasFile('imageDesc')) {
                $images = [];

                foreach ($request->file('imageDesc') as $file) {
                    $path = $file->store('products/descriptions', 'public');
                    $fullUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);

                    $images[] = [
                        'product_id' => $product->id,
                        'url' => $fullUrl,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                DB::table('images')->insert($images);
            }

            // Xử lý variants
            $existingVariant = VariantProduct::where('product_id', $product->id)
                ->where('name', $variantInput['name'] ?? '')
                ->first();

            if ($existingVariant) {
                // Tên biến thể đã tồn tại → có thể throw exception hoặc bỏ qua, hoặc trả lỗi
                throw new \Exception('Tên biến thể đã tồn tại trong sản phẩm.');
            }
            $variantsInput = $request->input('variants', []);
            foreach ($variantsInput as $index => $variantInput) {
                $variant = VariantProduct::create([
                    'product_id' => $product->id,
                    'name' => $variantInput['name'] ?? '',
                    'quantity' => $variantInput['quantity'] ?? 0,
                    'size_id' => $variantInput['size_id'] ?? null,
                    'color_id' => $variantInput['color_id'] ?? null,
                    'status' => $variantInput['status'] ?? 'active',
                ]);

                // Xử lý ảnh variant nếu có
                $variantImagesKey = "variants.$index.images";
                if ($request->hasFile($variantImagesKey)) {
                    $images = [];
                    foreach ($request->file($variantImagesKey) as $file) {
                        $path = $file->store('products/variants', 'public');
                        $fullUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);

                        $images[] = [
                            'variant_product_id' => $variant->id,
                            'image_url' => $fullUrl,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    VariantImage::insert($images);
                }
            }

            DB::commit();

            return $this->successResponse(
                $product->load(['variants.size', 'variants.color', 'variants.images']),
                'Tạo sản phẩm thành công',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi tạo sản phẩm: ' . $e->getMessage());
            return $this->errorResponse('Tạo sản phẩm thất bại', 500);
        }
    }



    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::with('variants.images')->find($id);
        if (!$product) {
            return $this->errorResponse('Sản phẩm không tồn tại', 404);
        }

        DB::beginTransaction();
        try {
            $data = $request->only([
                'name', 'category_id', 'description', 'price', 'sale_price', 'sale_end', 'status', 'image'
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $imageUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);
                $data['image'] = $imageUrl;
            }

            $product->update($data);

            // Xử lý ảnh mô tả sản phẩm
            if ($request->hasFile('image_desc')) {
            // XÓA MỀM ẢNH MÔ TẢ CŨ
                $product->images()->delete(); // Soft delete

                $descImages = [];
                foreach ($request->file('image_desc') as $file) {
                    $path = $file->store('products/descriptions', 'public');
                    $url = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);
                    $descImages[] = [
                        'product_id' => $product->id,
                        'url' => $url,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                Image::insert($descImages);
            } elseif ($request->has('image_desc') && is_array($request->image_desc)) {
                // XÓA MỀM ẢNH MÔ TẢ CŨ
                $product->images()->delete(); // Soft delete

                $descImages = array_map(fn ($url) => [
                    'product_id' => $product->id,
                    'url' => $url,
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $request->image_desc);

                Image::insert($descImages);
            }

            $variantIdsMustDelete = array_diff(
                array_column($product->variants->toArray() ?? [], 'id'),
                array_column($request->variants ?? [], 'id')
            );

            if (!empty($variantIdsMustDelete)) {
                $hasOrderedVariant = VariantProduct::whereIn('id', $variantIdsMustDelete)
                    ->whereHas('orderItems')
                    ->exists();

                if ($hasOrderedVariant) {
                    DB::rollBack();
                    return $this->errorResponse('Không thể xoá biến thể vì biến thể đã phát sinh đơn hàng', 400);
                }

                // Nếu không có biến thể nào đã được đặt hàng, mới xoá ảnh và biến thể
                $variantImages = VariantImage::whereIn('variant_product_id', $variantIdsMustDelete)->get();
                foreach ($variantImages as $variantImage) {
                    if (isset($variantImage->image_url)) {
                        $imageUrl = $variantImage->image_url;
                        $path = Str::startsWith($imageUrl, ['http://', 'https://'])
                            ? Str::after($imageUrl, '/storage/')
                            : Str::replaceFirst('/storage/', '', $imageUrl);

                        if (Storage::disk('public')->exists($path)) {
                            Storage::disk('public')->delete($path);
                        }
                    }
                    $variantImage->delete();
                }

                VariantProduct::whereIn('id', $variantIdsMustDelete)->delete();
            }

            // dd(1);
            if (!empty($request->variants)) {
                foreach ($request->variants as $index => $variantInput) {
                    if (isset($variantInput['id'])) {
                        $variant = $product->variants->firstWhere('id', $variantInput['id']);
                        if ($variant) {
                            $variant->update([
                                'name' => $variantInput['name'],
                                'quantity' => $variantInput['quantity'],
                                'size_id' => $variantInput['size_id'],
                                'color_id' => $variantInput['color_id'],
                                'status' => $variantInput['status'],
                            ]);

                            $variantImagesKey = "variants.$index.images";
                            if ($request->hasFile($variantImagesKey)) {
                                $variant->images()->delete();
                                $images = [];
                                foreach ($request->file($variantImagesKey) as $file) {
                                    $path = $file->store('products/variants', 'public');
                                    $fullUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);

                                    $images[] = [
                                        'variant_product_id' => $variant->id,
                                        'image_url' => $fullUrl,
                                        'created_at' => now(),
                                        'updated_at' => now(),
                                    ];
                                }
                                VariantImage::insert($images);
                            } elseif (array_key_exists('images', $variantInput)) {
                                // Nếu client gửi lên 'images', kể cả rỗng → xóa ảnh cũ
                                $variant->images()->delete();

                                if (is_array($variantInput['images']) && count($variantInput['images']) > 0) {
                                    $newImages = array_map(fn ($url) => [
                                        'variant_product_id' => $variant->id,
                                        'image_url' => $url,
                                        'created_at' => now(),
                                        'updated_at' => now(),
                                    ], $variantInput['images']);
                                    VariantImage::insert($newImages);
                                }
                            }
                        }
                    } else {
                        $duplicate = $product->variants
                            ->where('name', $variantInput['name'])
                            ->first();

                        if ($duplicate) {
                            return $this->errorResponse("Tên biến thể '{$variantInput['name']}' đã tồn tại trong sản phẩm.", 422);
                        }

                        $newVariant = VariantProduct::create([
                            'product_id' => $product->id,
                            'name' => $variantInput['name'],
                            'quantity' => $variantInput['quantity'],
                            'size_id' => $variantInput['size_id'],
                            'color_id' => $variantInput['color_id'],
                            'status' => $variantInput['status'],
                        ]);

                        $variantImagesKey = "variants.$index.images";
                        if ($request->hasFile($variantImagesKey)) {
                            $images = [];
                            foreach ($request->file($variantImagesKey) as $file) {
                                $path = $file->store('products/variants', 'public');
                                $fullUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);

                                $images[] = [
                                    'variant_product_id' => $newVariant->id,
                                    'image_url' => $fullUrl,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            }
                            VariantImage::insert($images);
                        } elseif (isset($variantInput['images']) && is_array($variantInput['images'])) {
                            $newImages = array_map(fn ($url) => [
                                'variant_product_id' => $newVariant->id,
                                'image_url' => $url,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ], $variantInput['images']);
                            VariantImage::insert($newImages);
                        }
                    }
                }
            }

            DB::commit();
            return $this->successResponse(
                $product->load(['variants.size', 'variants.color', 'variants.images', 'images']),
                'Cập nhật sản phẩm thành công'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi cập nhật sản phẩm: ' . $e->getMessage());
            return $this->errorResponse('Cập nhật sản phẩm thất bại');
        }
    }



    public function destroy($id)
    {
        $product = Product::with('variants.images')->find($id);

        if (!$product) {
            return $this->errorResponse('Sản phẩm không tồn tại', 404);
        }

        if ($product->orderItems()->exists()) {
            return $this->errorResponse('Không thể xóa sản phẩm này vì sản phẩm đã phát sinh đơn hàng', 400);
        }

        foreach ($product->variants as $variant) {
            if ($variant->orderItems()->exists()) {
                return $this->errorResponse('Không thể xóa sản phẩm này vì có biến thể đã được đặt hàng', 400);
            }
        }

        DB::beginTransaction();
        try {
            foreach ($product->variants as $variant) {
                $variant->images()->delete();
            }

            $product->variants()->delete();
            $product->delete();

            DB::commit();
            return $this->successResponse(null, 'Xóa sản phẩm thành công');
        } catch (\Exception $e) {
            DB::rollBack();
            log::error('Product deletion failed: ' . $e->getMessage());
            return $this->errorResponse('Xóa sản phẩm thất bại. Vui lòng thử lại.', 500);
        }
    }



    public function trashed()
    {
        $products = Product::onlyTrashed()->with('category')->get();
        return $this->successResponse($products);
    }

    public function restore($id)
    {
        $product = Product::onlyTrashed()->find($id);
        if (!$product) {
            return $this->errorResponse('Sản phẩm đã xóa không tồn tại', 404);
        }

        $product->restore();
        return $this->successResponse($product, 'Khôi phục sản phẩm thành công');
    }
}
