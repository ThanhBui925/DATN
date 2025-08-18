<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Cart;
use Illuminate\Support\Facades\Log;
use App\Models\Address;


class ShippingFeeService
{
    public static function calculate($userId, $data)
    {
        $fromDistrict = 1485;
        $fromWardCode = '1A0606';
        $insurance = 0;

        // Xác định địa chỉ đến
        if (isset($data['address_id'])) {
            $address = \App\Models\Address::findOrFail($data['address_id']);

            $province = self::matchProvinceByName($address->province_name);
            if (!$province) {
                throw new \Exception('Không tìm thấy tỉnh từ address.');
            }

            $district = self::matchDistrictByName($province['ProvinceID'], $address->district_name);
            if (!$district) {
                throw new \Exception('Không tìm thấy huyện từ address.');
            }

            $ward = self::matchWardByName($district['DistrictID'], $address->ward_name);
            if (!$ward) {
                throw new \Exception('Không tìm thấy xã từ address.');
            }

            $toDistrictId = $district['DistrictID'];
            $toWardCode = $ward['WardCode'];
        } elseif (
            isset($data['province_id']) &&
            isset($data['district_id']) &&
            isset($data['ward_code'])
        ) {
            $toDistrictId = (int) $data['district_id'];
            $toWardCode = $data['ward_code'];
        } else {
            throw new \Exception('Thiếu thông tin địa chỉ để tính phí.');
        }

        // Lấy giỏ hàng và tính toán
        $cart = Cart::where('user_id', $userId)->firstOrFail();
        $cartItems = $cart->items()->with('product')->get();

        $totalQty = $cartItems->sum('quantity');
        if ($totalQty <= 0) {
            throw new \Exception('Tổng số lượng sản phẩm không hợp lệ.');
        }

        $maxPerBox = 8;
        $boxes = ceil($totalQty / $maxPerBox);
        $weightPerShoe = 500;
        $totalShippingFee = 0;

        for ($i = 0; $i < $boxes; $i++) {
            $shoesInBox = min($maxPerBox, $totalQty - $i * $maxPerBox);
            $weight = $weightPerShoe * $shoesInBox;

            [$length, $width, $height] = match (true) {
                $shoesInBox <= 1 => [35, 24, 14],
                $shoesInBox <= 3 => [40, 30, 16],
                $shoesInBox <= 5 => [50, 35, 18],
                $shoesInBox <= 7 => [60, 40, 20],
                default => [70, 45, 25],
            };

            $res = Http::withHeaders([
                'Token' => env('GHN_TOKEN'),
                'ShopId' => env('GHN_SHOP_ID'),
                'Content-Type' => 'application/json',
            ])->post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', [
                "service_type_id" => 2,
                "insurance_value" => $insurance,
                "coupon" => null,
                "from_district_id" => $fromDistrict,
                "from_ward_code" => $fromWardCode,
                "to_district_id" => $toDistrictId,
                "to_ward_code" => $toWardCode,
                "height" => $height,
                "length" => $length,
                "weight" => $weight,
                "width" => $width,
            ]);

            if (!$res->ok() || empty($res['data']['total'])) {
                throw new \Exception("GHN tính phí thất bại ở kiện số " . ($i + 1));
            }

            $totalShippingFee += $res['data']['total'];
        }

        return $totalShippingFee;
    }


    public static function createOrder($order, $recipientName, $recipientPhone, $shippingAddress, $shippingData, $items, $oldStatus = null)
{
    $token = env('GHN_TOKEN');
    $shopId = env('GHN_SHOP_ID');

    if (empty($items)) {
        throw new \Exception("Không có sản phẩm nào trong đơn hàng.");
    }

    $totalQty = array_sum(array_column($items, 'quantity'));
    $maxPerBox = 8;
    $boxes = ceil($totalQty / $maxPerBox);
    $weightPerItem = 500;

    $fromDistrict = 1485;
    $fromWardCode = '1A0606';
    $insurance = 0;

    $totalWeight = 0;
    $maxBoxDimension = ['length'=>0,'width'=>0,'height'=>0];

    for ($i=0; $i<$boxes; $i++) {
        $itemsInBox = min($maxPerBox, $totalQty - $i*$maxPerBox);
        $weight = $itemsInBox * $weightPerItem;
        $totalWeight += $weight;

        [$length,$width,$height] = match(true){
            $itemsInBox<=1 => [35,24,14],
            $itemsInBox<=3 => [40,30,16],
            $itemsInBox<=5 => [50,35,18],
            $itemsInBox<=7 => [60,40,20],
            default => [70,45,25],
        };

        $maxBoxDimension['length'] = max($maxBoxDimension['length'],$length);
        $maxBoxDimension['width'] = max($maxBoxDimension['width'],$width);
        $maxBoxDimension['height'] = max($maxBoxDimension['height'],$height);
    }

    $orderCode = 'ORDER_'.$order->id;

    $response = Http::withHeaders([
        'Token'=>$token,
        'ShopId'=>$shopId,
        'Content-Type'=>'application/json',
    ])->post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create', [
        "payment_type_id"=>1,
        "note"=>"Giao buổi sáng",
        "required_note"=>"CHOXEMHANGKHONGTHU",
        "to_name"=>$recipientName,
        "to_phone"=>$recipientPhone,
        "to_address"=>$shippingAddress,
        "to_ward_code"=>$shippingData['ward_code'],
        "to_district_id"=>$shippingData['district_id'],
        'cod_amount'=>$order->payment_status==='paid'?0:(int)$order->final_amount,
        "content"=>"Đơn hàng #".$order->id,
        "weight"=>$totalWeight,
        "length"=>$maxBoxDimension['length'],
        "width"=>$maxBoxDimension['width'],
        "height"=>$maxBoxDimension['height'],
        "service_type_id"=>2,
        "service_id"=>53320,
        "order_code"=>$orderCode,
        "pick_station_id"=>0,
        "from_name"=>"SportWolk",
        "from_phone"=>"0909090909",
        "from_address"=>"22 ngõ 68 Cầu Giấy, Hà Nội",
        "from_province_name"=>"Hà Nội",
        "from_district_id"=>$fromDistrict,
        "from_ward_code"=>$fromWardCode,
        "items"=>$items,
        "insurance_value"=>$insurance,
    ]);

    if ($response->successful()) {
        $data = $response->json();
        if (isset($data['code']) && $data['code']===200) return $data;

        if ($oldStatus) {
            $order->order_status = 'shipping';
            $order->shipping_status = 'ready_to_pick';
            $order->save();
        }

        throw new \Exception("GHN trả về lỗi: " . ($data['message'] ?? json_encode($data)));
    } else {
        $errorBody = $response->json() ?? $response->body();

        Log::error('GHN HTTP Error', [
            'status'=>$response->status(),
            'body'=>$errorBody,
        ]);

        if ($oldStatus) {
            $order->order_status = $oldStatus;
            $order->save();
        }

        return $this->error("GHN tạo đơn thất bại: ".(is_array($errorBody)?json_encode($errorBody):$errorBody), 500);
    }
}



    public static function matchProvinceByName($name)
    {
        $res = Http::withHeaders(['Token' => env('GHN_TOKEN')])
            ->get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province');

        return collect($res['data'])->first(function ($item) use ($name) {
            $normalizedInput = strtolower(trim($name));

            // So sánh chính xác với tên chính thức
            if (strtolower(trim($item['ProvinceName'])) == $normalizedInput) {
                return true;
            }

            // So sánh với các tên mở rộng (alias)
            foreach ($item['NameExtension'] ?? [] as $alias) {
                if (strtolower(trim($alias)) == $normalizedInput) {
                    return true;
                }
            }

            return false;
        });
    }



    public static function matchDistrictByName($provinceId, $name)
    {
        $res = Http::withHeaders(['Token' => env('GHN_TOKEN')])
            ->get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district', [
                'province_id' => $provinceId
            ]);

        return collect($res['data'])->first(function ($item) use ($name) {
            $normalizedInput = strtolower(trim($name));

            if (strtolower(trim($item['DistrictName'])) == $normalizedInput) {
                return true;
            }

            foreach ($item['NameExtension'] ?? [] as $alias) {
                if (strtolower(trim($alias)) == $normalizedInput) {
                    return true;
                }
            }

            return false;
        });
    }


    public static function matchWardByName($districtId, $name)
    {
        $res = Http::withHeaders(['Token' => env('GHN_TOKEN')])
            ->get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward', [
                'district_id' => $districtId
            ]);

        return collect($res['data'])->first(function ($item) use ($name) {
            $normalizedInput = strtolower(trim($name));

            if (strtolower(trim($item['WardName'])) == $normalizedInput) {
                return true;
            }

            foreach ($item['NameExtension'] ?? [] as $alias) {
                if (strtolower(trim($alias)) == $normalizedInput) {
                    return true;
                }
            }

            return false;
        });
    }

}
