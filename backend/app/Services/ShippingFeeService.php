<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Cart;

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
            ])->post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', [
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

    private static function matchProvinceByName($name)
    {
        $res = Http::withHeaders(['Token' => env('GHN_TOKEN')])
            ->get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province');

        return collect($res['data'])->first(function ($item) use ($name) {
            $normalizedInput = strtolower(trim($name));

            // So sánh chính xác với tên chính thức
            if (strtolower(trim($item['ProvinceName'])) === $normalizedInput) {
                return true;
            }

            // So sánh với các tên mở rộng (alias)
            foreach ($item['NameExtension'] ?? [] as $alias) {
                if (strtolower(trim($alias)) === $normalizedInput) {
                    return true;
                }
            }

            return false;
        });
    }



    private static function matchDistrictByName($provinceId, $name)
    {
        $res = Http::withHeaders(['Token' => env('GHN_TOKEN')])
            ->get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', [
                'province_id' => $provinceId
            ]);

        return collect($res['data'])->first(function ($item) use ($name) {
            $normalizedInput = strtolower(trim($name));

            if (strtolower(trim($item['DistrictName'])) === $normalizedInput) {
                return true;
            }

            foreach ($item['NameExtension'] ?? [] as $alias) {
                if (strtolower(trim($alias)) === $normalizedInput) {
                    return true;
                }
            }

            return false;
        });
    }


    private static function matchWardByName($districtId, $name)
    {
        $res = Http::withHeaders(['Token' => env('GHN_TOKEN')])
            ->get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', [
                'district_id' => $districtId
            ]);

        return collect($res['data'])->first(function ($item) use ($name) {
            $normalizedInput = strtolower(trim($name));

            if (strtolower(trim($item['WardName'])) === $normalizedInput) {
                return true;
            }

            foreach ($item['NameExtension'] ?? [] as $alias) {
                if (strtolower(trim($alias)) === $normalizedInput) {
                    return true;
                }
            }

            return false;
        });
    }

}
