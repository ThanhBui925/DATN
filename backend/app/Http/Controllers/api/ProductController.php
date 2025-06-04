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
            $product = Product::create($request->only([
                'name', 'category_id', 'description', 'price', 'sale_price', 'sale_end', 'image', 'status'
            ]));

            foreach ($request->variants as $variantInput) {
                $variant = VariantProduct::create([
                    'product_id' => $product->id,
                    'name' => $variantInput['name'],
                    'quantity' => $variantInput['quantity'],
                    'size_id' => $variantInput['size_id'],
                    'color_id' => $variantInput['color_id'],
                    'status' => $variantInput['status'],
                ]);

                if (!empty($variantInput['images'])) {
                    $images = collect($variantInput['images'])->map(fn ($url) => [
                        'variant_product_id' => $variant->id,
                        'image_url' => $url,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ])->toArray();

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
            return $this->errorResponse('Tạo sản phẩm thất bại');
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
                'name', 'category_id', 'description', 'price', 'sale_price', 'sale_end', 'status'
            ]);
            if ($request->filled('image')) {
                $data['image'] = $request->image;
            }
            $product->update($data);

            foreach ($request->variants as $variantInput) {
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

                        if (isset($variantInput['images'])) {
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
                    $newVariant = VariantProduct::create([
                        'product_id' => $product->id,
                        'name' => $variantInput['name'],
                        'quantity' => $variantInput['quantity'],
                        'size_id' => $variantInput['size_id'],
                        'color_id' => $variantInput['color_id'],
                        'status' => $variantInput['status'],
                    ]);

                    if (isset($variantInput['images'])) {
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
