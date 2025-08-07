<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Voucher;
use App\Models\Address;
use App\Services\ShippingFeeService;
use App\Traits\ApiResponseTrait;


class CheckoutController extends Controller
{
    use ApiResponseTrait;
    public function confirm(Request $request)
    {
        $user = auth()->user();

        $cartItemsIds = json_decode($request->input('cartItemsIds'), true);
        if (empty($cartItemsIds) || !is_array($cartItemsIds)) {
            return $this->errorResponse('Danh sách sản phẩm không hợp lệ', 400);
        }

        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            return $this->errorResponse('Không tìm thấy giỏ hàng', 404);
        }

        $items = $cart->items()
            ->with([
                'product' => function ($q) {
                    $q->select('id', 'name', 'image', 'price', 'sale_price', 'description');
                },
                'variant.color:id,name',
                'variant.size:id,name',
                'variant.images' // Add images relationship
            ])
            ->whereIn('id', $cartItemsIds)
            ->get();

        if ($items->isEmpty()) {
            return $this->errorResponse('Không có sản phẩm hợp lệ trong giỏ hàng', 404);
        }

        // Tính tổng tiền dựa vào sale_price nếu có, ngược lại dùng price
        $totalPrice = $items->sum(function ($item) {
            $price = $item->product->sale_price ?? $item->product->price;
            return $item->quantity * $price;
        });

        // Format lại dữ liệu trả về
        $formattedItems = $items->map(function ($item) {
            $price = $item->product->sale_price ?? $item->product->price;

            return [
                'cart_item_id' => $item->id,
                'quantity' => $item->quantity,
                'total' => $item->quantity * $price,
                'image' => $item->product->image, // Keep product image as fallback
                'variant_id' => $item->variant_id,
                'size' => $item->variant->size->name ?? null,
                'size_id' => $item->variant->size_id,
                'color' => $item->variant->color->name ?? null,
                'color_id' => $item->variant->color_id,
                'product_id' => $item->product->id,
                'product_name' => $item->product->name,
                'variant_images' => $item->variant->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_url' => $image->image_url,
                    ];
                })->toArray(),
            ];
        });

        return $this->success([
            'items' => $formattedItems,
            'total' => $totalPrice,
        ], 'Thành công');
    }



}
