<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\ShoppingCartItem;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\User;
use App\Models\VariantProduct;
use App\Traits\ApiResponseTrait;


class CartController extends Controller
{
    use ApiResponseTrait;
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $cart = Cart::with(['items.product', 'items.variant.size', 'items.variant.color'])
            ->where('user_id', $userId)
            ->first();

        if (!$cart) {
            return $this->success(['items' => [], 'total' => 0], 'Giỏ hàng rỗng');
        }

        $cartItems = $cart->items->map(function ($item) {
            $price = $item->product->sale_price ?? $item->product->price;
            $productVariants = VariantProduct::where('product_id', $item->product_id)
                ->where('status', 1)
                ->where('quantity', '>', 0)
                ->with(['size', 'color', 'images'])
                ->get()
                ->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'size' => $variant->size->name ?? null,
                        'color' => $variant->color->name ?? null,
                        'quantity' => $variant->quantity,
                        'images' => $variant->images->map(function ($image) {
                            return [
                                'id' => $image->id,
                                'image_url' => $image->image_url,
                            ];
                        })->toArray(),
                    ];
                });

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product' => $item->product,
                'product_name' => $item->product->name,
                'variant_id' => $item->variant_id,
                'size' => $item->variant->size->name ?? null,
                'color' => $item->variant->color->name ?? null,
                'price' => $price,
                'quantity' => $item->quantity,
                'total' => $price * $item->quantity,
                'image' => $item->product->image,
                'available_variants' => $productVariants,
            ];
        });

        $total = $cartItems->sum('total');

        return $this->success([
            'items' => $cartItems,
            'total' => $total,
        ], 'Lấy giỏ hàng thành công');
    }
    
    public function store(Request $request)
    {
        $userId = $request->user()->id ?? $request->input('user_id');

        if (!$userId) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập hoặc truyền user_id để thêm sản phẩm vào giỏ hàng.',
                'status' => false,
            ], 400);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'color_id' => 'required|exists:colors,id',
            'size_id' => 'required|exists:sizes,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = VariantProduct::where('product_id', $request->product_id)
            ->where('color_id', $request->color_id)
            ->where('size_id', $request->size_id)
            ->first();

        if (!$variant) {
            return response()->json([
                'message' => 'Không tìm thấy biến thể phù hợp với màu sắc và kích cỡ.',
                'status' => false,
            ], 404);
        }

        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        $item = $cart->items()
            ->where('product_id', $request->product_id)
            ->where('variant_id', $variant->id)
            ->first();

        if ($item) {
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            $item = $cart->items()->create([
                'product_id' => $request->product_id,
                'variant_id' => $variant->id,
                'quantity' => $request->quantity,
            ]);
        }

        return $this->success($item, 'Thêm sản phẩm vào giỏ hàng thành công');
    }

    public function update(Request $request, $cartItemId)
    {
        $request->validate([
            'variant_id' => 'required|exists:variant_products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = ShoppingCartItem::where('id', $cartItemId)
            ->whereHas('cart', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->firstOrFail();

        $variant = VariantProduct::where('id', $request->variant_id)
            ->where('product_id', $cartItem->product_id)
            ->where('quantity', '>', 0)
            ->where('status', 1)
            ->firstOrFail();

        if ($variant->quantity < $request->quantity) {
            return $this->error('Số lượng vượt quá tồn kho', 400);
        }

        $cartItem->update([
            'variant_id' => $request->variant_id,
            'quantity' => $request->quantity,
        ]);

        return $this->success(null, 'Cập nhật giỏ hàng thành công');
    }

    public function getProductVariants(Request $request, $productId)
    {
        $variants = VariantProduct::where('product_id', $productId)
            ->where('status', 1)
            ->where('quantity', '>', 0)
            ->with(['size', 'color'])
            ->get()
            ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'size' => $variant->size->name ?? null,
                    'color' => $variant->color->name ?? null,
                    'quantity' => $variant->quantity,
];
            });

        return $this->success($variants, 'Lấy danh sách biến thể thành công');
    }

    public function destroy($itemId)
    {
        $item = ShoppingCartItem::find($itemId);

        if (!$item) {
            return response()->json([
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng',
                'status' => false,
            ], 404);
        }

        $cart = $item->cart;

        $item->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công',
            'status' => true,
        ]);
    }

}
