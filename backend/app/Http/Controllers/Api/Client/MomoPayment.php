<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MomoPayment extends Controller
{
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }

    public function momo_payment(Request $request)
    {
        // Validate dữ liệu đầu vào
        $request->validate([
            'total_momo' => 'required|numeric|min:1000'
        ], [
            'total_momo.required' => 'Số tiền thanh toán không được để trống',
            'total_momo.numeric' => 'Số tiền phải là số',
            'total_momo.min' => 'Số tiền tối thiểu là 1,000 VNĐ'
        ]);

        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

        $orderInfo = "Thanh toán qua MoMo";
        $amount = $request->input('total_momo'); 
        $orderId = time() . "";
        $redirectUrl = "http://localhost:3000/checkout";
        $ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        $extraData = "";
        
        $requestId = time() . "";
        $requestType = "payWithATM";
        
        //before sign HMAC SHA256 signature
        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);
        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Test",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );

        Log::info('MOMO Payment Request:', $data);

        $result = $this->execPostRequest($endpoint, json_encode($data));
        
        if ($result === false) {
            Log::error('MOMO Payment CURL Error');
            return response()->json([
                'error' => 'Lỗi kết nối đến MOMO'
            ], 500);
        }

        $jsonResult = json_decode($result, true);

        Log::info('MOMO Payment Response:', ['result' => $jsonResult]);

        if (isset($jsonResult['payUrl'])) {
            return response()->json(['payUrl' => $jsonResult['payUrl']]);
        } else {
            return response()->json([
                'error' => 'Không thể tạo thanh toán MOMO', 
                'momo_response' => $jsonResult
            ], 400);
        }
    }
}
