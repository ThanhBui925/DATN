<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderSuccessMail;


class VNPayController extends Controller
{
    public function paymentReturn(Request $request)

    {
        $vnp_SecureHash = $request->input('vnp_SecureHash');

        $inputData = $request->except(['vnp_SecureHash', 'vnp_SecureHashType']);
        ksort($inputData);

        $hashDataArr = [];
        foreach ($inputData as $key => $value) {
            $hashDataArr[] = urlencode($key) . '=' . urlencode($value);
        }
        $hashData = implode('&', $hashDataArr);

        $secureHash = hash_hmac('sha512', $hashData, config('vnpay.hash_secret'));

        if ($secureHash !== $vnp_SecureHash) {
            Log::warning('VNPay return: Invalid hash');
            return response('Invalid checksum', 400);
        }

        $orderId = $request->input('vnp_TxnRef');
        $transactionStatus = $request->input('vnp_TransactionStatus');

        $order = Order::find($orderId);

        $cartItemsIds = Cache::get('vnpay_order_cart_items_' . $order->id);
        if (!$order) {
            return response('Order not found', 404);
        }

        if ($transactionStatus === '00') {
            $order->payment_status = 'paid';
            $order->payment_method = 'vnpay';
            $order->order_status = 'confirmed';
            $order->save();

            if (!empty($cartItemsIds)) {
                \App\Models\ShoppingCartItem::whereIn('id', $cartItemsIds)->delete();
            }
    
            // Xoá cache sau khi xử lý xong
            Cache::forget('vnpay_order_cart_items_' . $order->id);
            Mail::to($order->user->email)->queue(new OrderSuccessMail($order)); // người đặt
            if ($order->recipient_email && $order->recipient_email !== $order->user->email) {
                Mail::to($order->recipient_email)->queue(new OrderSuccessMail($order)); // người nhận nếu khác
            }
            return redirect()->away("http://localhost:3000/chi-tiet-don-hang/{$order->id}?showMsg=1");
            
        } else {
            $order->payment_status = 'unpaid';
            $order->payment_method = 'vnpay';
            $order->order_status = 'pending';
            $order->use_shipping_status = 0;
            $order->save();
            return redirect()->away("http://localhost:3000/chi-tiet-don-hang/{$order->id}?showMsg=0");
        }
    }

}
