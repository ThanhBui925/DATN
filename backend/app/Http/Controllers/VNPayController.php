<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class VNPayController extends Controller
{
    public function paymentReturn(Request $request)
    {
        $vnp_SecureHash = $request->input('vnp_SecureHash');

        // 1. Lấy toàn bộ dữ liệu từ VNPay trừ vnp_SecureHash & vnp_SecureHashType
        $inputData = $request->except(['vnp_SecureHash', 'vnp_SecureHashType']);
        ksort($inputData);

        $hashDataArr = [];
        foreach ($inputData as $key => $value) {
            $hashDataArr[] = $key . '=' . $value;
        }
        $hashData = implode('&', $hashDataArr);

        $secureHash = hash_hmac('sha512', $hashData, config('vnpay.hash_secret'));

        Log::info('VNPay return hashData: ' . $hashData);
        Log::info('VNPay return secureHash: ' . $secureHash);
        Log::info('VNPay return vnp_SecureHash: ' . $vnp_SecureHash);

        // 3. So sánh chữ ký
        if ($secureHash !== $vnp_SecureHash) {
            Log::warning('VNPay return: Invalid hash');
            return response('Invalid checksum', 400);
        }

        // 4. Lấy mã đơn hàng
        $orderId = $request->input('vnp_TxnRef'); // ví dụ: 110
        $transactionStatus = $request->input('vnp_TransactionStatus'); // '00' nếu thành công

        // 5. Tìm đơn hàng trong DB
        $order = Order::find($orderId);

        if (!$order) {
            Log::warning("VNPay return: Order #$orderId not found");
            return response('Order not found', 404);
        }

        // 6. Nếu thành công thì cập nhật trạng thái
        if ($transactionStatus === '00') {
            $order->payment_status = 'paid'; // hoặc 1, hoặc 'Đã thanh toán' tuỳ hệ thống
            $order->payment_method = 'vnpay';
            $order->save();

            Log::info("VNPay return: Order #$orderId đã thanh toán thành công");
            return response('Thanh toán thành công', 200);
        } else {
            Log::info("VNPay return: Order #$orderId thanh toán thất bại");
            return response('Thanh toán thất bại', 200);
        }
    }

}
