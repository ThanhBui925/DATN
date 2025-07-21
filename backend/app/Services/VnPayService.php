<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class VnPayService
{
    public function createPaymentUrl($order)
    {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "https://localhost/vnpay_php/vnpay_return.php";
        $vnp_TmnCode = "0DUWN3BA";//Mã website tại VNPAY 
        $vnp_HashSecret = "LC6DXT29OEJLESM62JMCM67LULO7XHZX";

        $vnp_TxnRef = $order->id;
        $vnp_OrderInfo = 'Thanh toán đơn hàng #' . $order->id;
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = intval($order->final_amount) * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);

        $hashDataArr = [];
        foreach ($inputData as $key => $value) {
            $hashDataArr[] = $key . "=" . $value;
        }
        $hashData = implode('&', $hashDataArr);
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        
        $query = http_build_query($inputData);
        $paymentUrl = $vnp_Url . '?' . $query
        . '&vnp_SecureHashType=SHA512'
        . '&vnp_SecureHash=' . $secureHash;


        \Log::info("VNPay HashData: " . $hashData);
        \Log::info("VNPay SecureHash: " . $secureHash);
        \Log::info("VNPay Payment URL: " . $paymentUrl);

        return $paymentUrl;
    }




    public function handleCallback(array $input): bool|string
    {
       $vnp_HashSecret = config('vnpay.hash_secret');

        $vnp_SecureHash = $input['vnp_SecureHash'] ?? null;

        // Loại bỏ trước khi tạo hash lại
        unset($input['vnp_SecureHash'], $input['vnp_SecureHashType']);

        ksort($input);

        $hashData = '';
        foreach ($input as $key => $value) {
            $hashData .= $key . '=' . $value . '&';
        }
        $hashData = rtrim($hashData, '&');

        $secureHashCheck = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        // Ghi log chi tiết để kiểm tra
        Log::info("VNPay Callback HashData: " . $hashData);
        Log::info("VNPay Callback Calculated Hash: " . $secureHashCheck);
        Log::info("VNPay Callback Received Hash: " . $vnp_SecureHash);

        if ($secureHashCheck !== $vnp_SecureHash) {
            Log::error('VNPay Callback: Sai chữ ký');
            return false;
        }

        $orderId = $input['vnp_TxnRef'] ?? null;
        $responseCode = $input['vnp_ResponseCode'] ?? null;

        $order = Order::find($orderId);

        if (!$order) {
            Log::error("VNPay Callback: Không tìm thấy đơn hàng ID {$orderId}");
            return false;
        }

        if ($responseCode === '00') {
            $order->update([
                'payment_status' => 'paid',
                'order_status' => 'confirmed',
            ]);
            Log::info("VNPay Callback: Thanh toán thành công đơn #{$order->id}");
            return 'success';
        } else {
            $order->update([
                'payment_status' => 'failed',
            ]);
            Log::warning("VNPay Callback: Thanh toán thất bại đơn #{$order->id}");
            return 'failed';
        }
    }
}
