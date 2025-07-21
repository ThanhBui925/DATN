<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class VnPayService
{
    public function createPaymentUrl($order)
    {
        $vnp_Url = config('vnpay.url', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
        $vnp_Returnurl = config('vnpay.return_url', 'http://localhost:8000/payment-return');
        $vnp_TmnCode = config('vnpay.tmn_code', '0DUWN3BA');
        $vnp_HashSecret = config('vnpay.hash_secret', 'LC6DXT29OEJLESM62JMCM67LULO7XHZX');

        $vnp_TxnRef = $order->id;
        $order->update(['vnp_txn_ref' => $vnp_TxnRef]);

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

        // Sắp xếp và tạo chuỗi hash đúng chuẩn
        ksort($inputData);
        $hashDataArr = [];
        foreach ($inputData as $key => $value) {
            $hashDataArr[] = urlencode($key) . '=' . urlencode($value);
        }
        $hashData = implode('&', $hashDataArr);
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        // Tạo URL thanh toán
        $query = http_build_query($inputData, '', '&', PHP_QUERY_RFC3986);
        $paymentUrl = $vnp_Url . '?' . $query . '&vnp_SecureHashType=SHA512&vnp_SecureHash=' . $secureHash;

        Log::info("VNPay HashData: " . $hashData);
        Log::info("VNPay SecureHash: " . $secureHash);
        Log::info("VNPay Payment URL: " . $paymentUrl);

        return $paymentUrl;
    }

    public function handleCallback(array $input): bool|string
    {
        $vnp_HashSecret = config('vnpay.hash_secret', 'LC6DXT29OEJLESM62JMCM67LULO7XHZX');
        $vnp_SecureHash = $input['vnp_SecureHash'] ?? null;

        // Lọc các tham số bắt đầu bằng vnp_ (trừ hash)
        $filtered = array_filter($input, function ($key) {
            return strpos($key, 'vnp_') === 0;
        }, ARRAY_FILTER_USE_KEY);

        unset($filtered['vnp_SecureHash'], $filtered['vnp_SecureHashType']);
        ksort($filtered);

        $hashDataArr = [];
        foreach ($filtered as $key => $value) {
            $hashDataArr[] = urlencode($key) . '=' . urlencode($value);
        }
        $hashData = implode('&', $hashDataArr);

        $secureHashCheck = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        Log::info("VNPay Callback HashData: " . $hashData);
        Log::info("VNPay Callback Calculated Hash: " . $secureHashCheck);
        Log::info("VNPay Callback Received Hash: " . $vnp_SecureHash);

        if ($secureHashCheck !== $vnp_SecureHash) {
            Log::error('VNPay Callback: Sai chữ ký');
            return false;
        }

        $txnRef = $input['vnp_TxnRef'] ?? null;
        $responseCode = $input['vnp_ResponseCode'] ?? null;
        $order = Order::where('vnp_txn_ref', $txnRef)->first();

        if (!$order) {
            Log::error("VNPay Callback: Không tìm thấy đơn hàng với mã vnp_TxnRef {$txnRef}");
            return false;
        }

        if ($order->payment_status === 'paid') {
            Log::info("VNPay Callback: Đơn hàng {$order->id} đã được thanh toán trước đó.");
            return 'already_paid';
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
