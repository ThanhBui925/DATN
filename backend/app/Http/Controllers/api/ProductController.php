<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\VariantImage;
use App\Models\Size;
use App\Models\Color;
use App\Models\Category;
use App\Models\VariantProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $products = Product::with([
            'category',
            'variants.size',
            'variants.color',
            'variants.images' // lấy luôn ảnh biến thể
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json(['data' => $products], 200);
    }



    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $input['name'] = trim($input['name'] ?? '');
        $input['description'] = trim($input['description'] ?? '');

        if (isset($input['variants']) && is_array($input['variants'])) {
            foreach ($input['variants'] as &$variant) {
                $variant['name'] = trim($variant['name'] ?? '');
            }
            unset($variant);
        }

        $request->replace($input);

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|lt:price|min:0',
            'sale_end' => 'nullable|date|after:now',
            'image' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'variants' => 'required|array|min:1',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.size_id' => 'required|exists:sizes,id',
            'variants.*.color_id' => 'required|exists:colors,id',
            'variants.*.quantity' => 'required|integer|min:0',
            'variants.*.status' => 'required|in:active,inactive',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'string',
        ]);

        DB::beginTransaction();
        try {
            // Tạo sản phẩm
            $product = Product::create($request->only([
                'name', 'category_id', 'description', 'price', 'sale_price', 'sale_end', 'image', 'status'
            ]));

            // Tạo biến thể & ảnh biến thể
            foreach ($request->variants as $variantInput) {
                $variant = VariantProduct::create([
                    'product_id' => $product->id,
                    'name' => $variantInput['name'],
                    'quantity' => $variantInput['quantity'],
                    'size_id' => $variantInput['size_id'],
                    'color_id' => $variantInput['color_id'],
                    'status' => $variantInput['status'],
                ]);

                if (!empty($variantInput['images']) && is_array($variantInput['images'])) {
                    $variantImages = collect($variantInput['images'])->map(function ($url) use ($variant) {
                        return [
                            'variant_product_id' => $variant->id,
                            'image_url' => $url,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    })->toArray();

                    VariantImage::insert($variantImages);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Tạo sản phẩm thành công',
                'data' => $product->load([
                    'variants.size',
                    'variants.color',
                    'variants.images'
                ]),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Product creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create product. Please try again.'], 500);
        }
    }




    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $product = Product::with(['category', 'variants.size', 'variants.color'])->find($id);

        if (!$product) {
            return response()->json(['error' => 'Sản phẩm không tồn tại'], 404);
        }

        return response()->json([
            'data' => $product
        ]);
    }


    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::with('variants.images')->find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|lt:price|min:0',
            'sale_end' => 'nullable|date|after:now',
            'image' => 'nullable|string', // Ảnh chính sản phẩm
            'status' => 'required|in:active,inactive',
            'variants' => 'required|array|min:1',
            'variants.*.id' => 'nullable|exists:variant_products,id',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.size_id' => 'required|exists:sizes,id',
            'variants.*.color_id' => 'required|exists:colors,id',
            'variants.*.quantity' => 'required|integer|min:0',
            'variants.*.status' => 'required|in:active,inactive',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'string',
        ]);

        DB::beginTransaction();
        try {
            // Cập nhật thông tin sản phẩm, chỉ cập nhật ảnh chính nếu có dữ liệu mới
            $updateProductData = $request->only([
                'name', 'category_id', 'description', 'price', 'sale_price', 'sale_end', 'status'
            ]);
            if ($request->filled('image')) {
                $updateProductData['image'] = $request->image;
            }
            $product->update($updateProductData);

            // Duyệt từng biến thể trong request
            foreach ($request->variants as $variantInput) {
                if (isset($variantInput['id'])) {
                    // Update biến thể đã có
                    $variant = $product->variants->firstWhere('id', $variantInput['id']);
                    if ($variant) {
                        $variant->update([
                            'name' => $variantInput['name'],
                            'quantity' => $variantInput['quantity'],
                            'size_id' => $variantInput['size_id'],
                            'color_id' => $variantInput['color_id'],
                            'status' => $variantInput['status'],
                        ]);

                        // Cập nhật ảnh biến thể nếu có ảnh mới
                        if (isset($variantInput['images'])) {
                            // Xóa ảnh cũ rồi insert ảnh mới
                            $variant->images()->delete();
                            $variantImagesData = array_map(function ($imageUrl) use ($variant) {
                                return [
                                    'variant_product_id' => $variant->id,
                                    'image_url' => $imageUrl,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            }, $variantInput['images']);
                            VariantImage::insert($variantImagesData);
                        }
                        // Nếu không có trường images, giữ nguyên ảnh cũ
                    }
                } else {
                    // Tạo biến thể mới
                    $variant = VariantProduct::create([
                        'product_id' => $product->id,
                        'name' => $variantInput['name'],
                        'quantity' => $variantInput['quantity'],
                        'size_id' => $variantInput['size_id'],
                        'color_id' => $variantInput['color_id'],
                        'status' => $variantInput['status'],
                    ]);

                    // Thêm ảnh biến thể mới nếu có
                    if (isset($variantInput['images'])) {
                        $variantImagesData = array_map(function ($imageUrl) use ($variant) {
                            return [
                                'variant_product_id' => $variant->id,
                                'image_url' => $imageUrl,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }, $variantInput['images']);
                        VariantImage::insert($variantImagesData);
                    }
                }
            }

            // Không xóa biến thể cũ nếu không có trong request (giữ nguyên)

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $product->load(['variants.size', 'variants.color', 'variants.images'])
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update product. Please try again.'], 500);
        }
    }



    /**
     * Remove the specified product from storage (soft delete).
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        DB::beginTransaction();
        try {
            // Xóa mềm ảnh của các biến thể
            foreach ($product->variants as $variant) {
                $variant->images()->delete(); // xóa mềm ảnh biến thể
            }

            // Xóa mềm các biến thể
            $product->variants()->delete();

            // Nếu có xóa mềm ảnh sản phẩm riêng, xóa mềm ở đây (nếu cần)
            // $product->images()->delete();

            // Xóa mềm sản phẩm
            $product->delete();

            DB::commit();
            return response()->json(['message' => 'Xóa sản phẩm thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete product. Please try again.'], 500);
        }
    }


    /**
     * Restore a soft-deleted product.
     */
    public function restore($id)
    {
        $product = Product::withTrashed()->with('variants')->find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        if (!$product->trashed()) {
            return response()->json(['message' => 'Product is not deleted'], 400);
        }

        // Restore product
        $product->restore();

        // Restore variants liên quan
        foreach ($product->variants as $variant) {
            if ($variant->trashed()) {
                $variant->restore();
            }
        }

        return response()->json([
            'message' => 'Product and variants restored successfully',
            'data' => $product->load(['variants.size', 'variants.color'])
        ], 200);
    }

    /**
     * Force delete a soft-deleted product.
     */
    public function trashed()
    {
        $trashedProducts = Product::onlyTrashed()->with(['variants.size', 'variants.color', 'variants.images'])->get();

        if ($trashedProducts->isEmpty()) {
            return response()->json(['message' => 'No trashed products found'], 404);
        }

        return response()->json(['data' => $trashedProducts], 200);
    }



     

}