<?php

namespace App\Http\Controllers\api\client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Traits\ApiResponseTrait;
use App\Models\Address;
use App\Models\ShoppingCartItem;
use App\Models\Cart;


class ShippingFeeController extends Controller
{
    use ApiResponseTrait;
    public function calculate(Request $request)
{
    $fromDistrict = (int) $request->input('from_district', 1485);
    $fromWardCode = $request->input('from_ward_code', '1A0606');
    $insurance = (int) $request->input('insurance_value', 0);

    $toDistrictId = null;
    $toWardCode = null;

    if ($request->has('address_id')) {
        $address = Address::findOrFail($request->input('address_id'));

        $province = $this->matchProvinceByName($address->province_name);
        if (!$province) return response()->json(['message' => 'Không tìm thấy tỉnh.'], 422);

        $district = $this->matchDistrictByName($province['ProvinceID'], $address->district_name);
        if (!$district) return response()->json(['message' => 'Không tìm thấy quận/huyện.'], 422);

        $ward = $this->matchWardByName($district['DistrictID'], $address->ward_name);
        if (!$ward) return response()->json(['message' => 'Không tìm thấy phường/xã.'], 422);

        $toDistrictId = $district['DistrictID'];
        $toWardCode = $ward['WardCode'];
    } elseif (
        $request->has('province_id') &&
        $request->has('district_id') &&
        $request->has('ward_code')
    ) {
        $toDistrictId = (int) $request->input('district_id');
        $toWardCode = $request->input('ward_code');
    } else {
        return response()->json(['message' => 'Thiếu thông tin địa chỉ.'], 422);
    }

    $cart = Cart::where('user_id', $request->user()->id)->first();

    if (!$cart) {
        return response()->json(['message' => 'Giỏ hàng không tồn tại.'], 422);
    }

    $cartItems = $cart->items()->with('product')->get();

    if ($cartItems->isEmpty()) {
        return response()->json(['message' => 'Giỏ hàng trống.'], 422);
    }

    $totalQty = $cartItems->sum('quantity');

    if ($totalQty <= 0) {
        return response()->json(['message' => 'Tổng số lượng không hợp lệ.'], 422);
    }

    $maxPerBox = 8;
    $boxes = ceil($totalQty / $maxPerBox);

    $weightPerShoe = 500;
    $totalShippingFee = 0;
    $details = [];

    for ($i = 0; $i < $boxes; $i++) {
        $shoesInBox = min($maxPerBox, $totalQty - $i * $maxPerBox);

        $weight = $weightPerShoe * $shoesInBox;

        if ($shoesInBox <= 1) {
            [$length, $width, $height] = [35, 24, 14];
        } elseif ($shoesInBox <= 3) {
            [$length, $width, $height] = [40, 30, 16];
        } elseif ($shoesInBox <= 5) {
            [$length, $width, $height] = [50, 35, 18];
        } elseif ($shoesInBox <= 7) {
            [$length, $width, $height] = [60, 40, 20];
        } else {
            [$length, $width, $height] = [70, 45, 25];
        }


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
            return response()->json(['message' => 'GHN tính phí thất bại ở kiện số ' . ($i + 1)], 422);
        }

        $fee = $res['data']['total'];
        $totalShippingFee += $fee;

        $details[] = [
            'box' => $i + 1,
            'shoes_in_box' => $shoesInBox,
            'weight' => $weight,
            'length' => $length,
            'width' => $width,
            'height' => $height,
            'fee' => $fee,
        ];
    }

    return response()->json([
        'total_shipping_fee' => $totalShippingFee,
        'total_boxes' => $boxes,
        'box_details' => $details
    ]);
}



    private function matchProvinceByName($name)
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



    private function matchDistrictByName($provinceId, $name)
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


    private function matchWardByName($districtId, $name)
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
