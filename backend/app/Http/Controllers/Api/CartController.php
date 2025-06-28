<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Http\Requests\DeleteCartRequest;
use App\Models\Cart;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class CartController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $cartItems = Cart::with('product')->where('user_id', $userId)->get();
        $total = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
        return $this->success([
            'items' => $cartItems,
            'total' => $total
        ], 'Lấy giỏ hàng thành công');
    }

    public function store(StoreCartRequest $request)
    {
        $userId = $request->user()->id;
        $productId = $request->product_id;
        $quantity = $request->quantity;
        $cartItem = Cart::where('user_id', $userId)->where('product_id', $productId)->first();
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cartItem = Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }
        return $this->success($cartItem, 'Thêm sản phẩm vào giỏ hàng thành công', 201);
    }

    public function destroy(DeleteCartRequest $request)
    {
        $userId = $request->user()->id;
        $productId = $request->product_id;
        $cartItem = Cart::where('user_id', $userId)->where('product_id', $productId)->first();
        if (!$cartItem) {
            return $this->error('Không tìm thấy sản phẩm trong giỏ hàng', null, 404);
        }
        $cartItem->delete();
        return $this->success(null, 'Xóa sản phẩm khỏi giỏ hàng thành công');
    }

    public function update(UpdateCartRequest $request)
    {
        $userId = $request->user()->id;
        $productId = $request->product_id;
        $quantity = $request->quantity;
        $cartItem = Cart::where('user_id', $userId)->where('product_id', $productId)->first();
        if (!$cartItem) {
            return $this->error('Không tìm thấy sản phẩm trong giỏ hàng', null, 404);
        }
        $cartItem->quantity = $quantity;
        $cartItem->save();
        return $this->success($cartItem, 'Cập nhật số lượng sản phẩm thành công');
    }
} 