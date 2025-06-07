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

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $products = Product::with([
            'category',
            'variants.size',
            'variants.color',
            'variants.images'
        ])->orderBy('created_at', 'desc')->get();

        return $this->successResponse($products);
    }

    public function show($id)
    {
        $product = Product::with([
            'category',
            'variants.size',
            'variants.color',
            'variants.images'
        ])->find($id);

        if (!$product) {
            return $this->errorResponse('Sản phẩm không tồn tại', 404);
        }

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
                $path = $request->file('image')->store('products', 'public'); // vd: products/abc.jpg
                $productData['image'] = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);
            }

            // Create product
            $product = Product::create($productData);

            // Xử lý variants: giả sử client gửi dạng mảng 'variants' trong request (không phải keys như variants[0][name])
            $variantsInput = $request->input('variants', []);

            foreach ($variantsInput as $index => $variantInput) {
                // Tạo variant
                $variant = VariantProduct::create([
                    'product_id' => $product->id,
                    'name' => $variantInput['name'] ?? '',
                    'quantity' => $variantInput['quantity'] ?? 0,
                    'size_id' => $variantInput['size_id'] ?? null,
                    'color_id' => $variantInput['color_id'] ?? null,
                    'status' => $variantInput['status'] ?? 'active',
                ]);

                // Xử lý ảnh variant nếu có
                // Ảnh variant nên được gửi lên dạng file input với key: variants.0.images, variants.1.images, ...
                $variantImagesKey = "variants.$index.images";

                if ($request->hasFile($variantImagesKey)) {
                    $images = [];
                    foreach ($request->file($variantImagesKey) as $file) {
                        // Lưu file lên storage public và lấy đường dẫn lưu trữ
                        $path = $file->store('products/variants', 'public');

                        // Chuyển thành URL đầy đủ (ví dụ: http://localhost/storage/...)
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
            // Xử lý ảnh chính: nếu có file upload thì lưu file + tạo URL đầy đủ
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $imageUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);
                $data['image'] = $imageUrl;
            }


            $product->update($data);

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

                        // Xử lý ảnh variant khi upload file
                        $variantImagesKey = "variants.$index.images";
                        if ($request->hasFile($variantImagesKey)) {
                            // Xóa ảnh cũ
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
                        }
                        // Nếu không upload file mà gửi ảnh dạng URL mảng thì cập nhật như cũ
                        elseif (isset($variantInput['images']) && is_array($variantInput['images'])) {
                            $variant->images()->delete();
                            $newImages = array_map(fn ($url) => [
                                'variant_product_id' => $variant->id,
                                'image_url' => $url,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ], $variantInput['images']);
                            VariantImage::insert($newImages);
                        }
                    }
                } else {
                    // Tạo variant mới
                    $newVariant = VariantProduct::create([
                        'product_id' => $product->id,
                        'name' => $variantInput['name'],
                        'quantity' => $variantInput['quantity'],
                        'size_id' => $variantInput['size_id'],
                        'color_id' => $variantInput['color_id'],
                        'status' => $variantInput['status'],
                    ]);

                    // Xử lý ảnh variant mới
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

            DB::commit();
            return $this->successResponse(
                $product->load(['variants.size', 'variants.color', 'variants.images']),
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

        DB::beginTransaction();
        try {
            // Xóa mềm ảnh của các biến thể
            foreach ($product->variants as $variant) {
                $variant->images()->delete(); // xóa mềm ảnh biến thể
            }

            // Xóa mềm các biến thể
            $product->variants()->delete();

            // Xóa mềm sản phẩm
            $product->delete();

            DB::commit();

            return $this->successResponse(null, 'Xóa sản phẩm thành công');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Product deletion failed: ' . $e->getMessage());
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
