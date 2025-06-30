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
        // Ưu tiên từ auth, fallback là user_id từ FE / Postman
        $userId = $request->user()->id ?? $request->input('user_id');

        if (!$userId) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập hoặc truyền user_id để lấy giỏ hàng.',
                'status' => false,
            ], 400);
        }

        $cart = Cart::with([
            'items.product',
            'items.variant.color',
            'items.variant.size',
            'items.variant.images',
        ])->firstOrCreate(
            ['user_id' => $userId],
            ['total_price' => 0]
        );

        $items = $cart->items->map(function ($item) {
            $variant = $item->variant;

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name ?? null,
                'variant_id' => $variant->id ?? null,
                'variant' => [
                    'name' => $variant->name ?? null,
                    'code' => $variant->code ?? null,
                    'size' => $variant->size->name ?? null,
                    'color' => $variant->color->name ?? null,
                    'color_code' => $variant->color->hex ?? null,
                    'images' => $variant->images->pluck('image_url'),
                ],
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->price * $item->quantity,
            ];
        });

        return response()->json([
            'message' => 'Lấy giỏ hàng thành công',
            'status' => true,
            'data' => [
                'cart_id' => $cart->id,
                'total_price' => $items->sum('total'),
                'items' => $items,
            ],
        ]);
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
            'variant_id' => 'required|exists:variant_products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $cart = Cart::firstOrCreate(
            ['user_id' => $userId],
            ['total_price' => 0]
        );

        $item = $cart->items()
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($item) {
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            $item = $cart->items()->create([
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'quantity' => $request->quantity,
                'price' => $request->price,
            ]);
        }

        $cart->load('items');
        $cart->total_price = $cart->items->sum(fn($item) => $item->price * $item->quantity);
        $cart->save();

        return $this->success($item, 'Thêm sản phẩm vào giỏ hàng thành công');

        // return response()->json([
        //     'message' => 'Thêm sản phẩm vào giỏ hàng thành công',
        //     'status' => true,
        //     'data' => $item,
        // ]);
    }

    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = ShoppingCartItem::find($itemId);

        if (!$item) {
            return response()->json([
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng',
                'status' => false,
            ], 404);
        }

        $item->quantity = $request->quantity;
        $item->save();

        
        $cart = $item->cart;
        $cart->load('items');
        $cart->total_price = $cart->items->sum(fn($i) => $i->price * $i->quantity);
        $cart->save();

        return response()->json([
            'message' => 'Cập nhật số lượng thành công',
            'status' => true,
            'data' => [
                'item_id' => $item->id,
                'quantity' => $item->quantity,
                'total_price' => $cart->total_price,
            ]
        ]);
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

        // Cập nhật lại tổng tiền
        if ($cart) {
            $cart->load('items');
            $cart->total_price = $cart->items->sum(fn($i) => $i->price * $i->quantity);
            $cart->save();
        }

        return response()->json([
            'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công',
            'status' => true,
        ]);
    }

}
