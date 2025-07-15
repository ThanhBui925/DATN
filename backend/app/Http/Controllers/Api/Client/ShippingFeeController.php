<?php

namespace App\Http\Controllers\api\client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Traits\ApiResponseTrait;


class ShippingFeeController extends Controller
{
    use ApiResponseTrait;
    public function calculate(Request $request)
    {
        $request->merge([
            'from_district' => (int) $request->input('from_district'),
            'to_district' => (int) $request->input('to_district'),
            'weight' => (int) $request->input('weight'),
            'insurance_value' => (int) $request->input('insurance_value'),
            'height' => (int) $request->input('height'),
            'length' => (int) $request->input('length'),
            'width' => (int) $request->input('width'),
        ]);

        $validated = $request->validate([
            'from_district' => 'required|integer',
            'to_district' => 'required|integer',
            'to_ward_code' => 'required|string',
            'weight' => 'required|integer',
            'height' => 'nullable|integer',
            'length' => 'nullable|integer',
            'width' => 'nullable|integer',
            'insurance_value' => 'nullable|integer',
        ]);

        $response = Http::withHeaders([
            'Token' => env('GHN_TOKEN'),
            'ShopId' => env('GHN_SHOP_ID'),
            'Content-Type' => 'application/json',
        ])->post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', [
            "service_type_id" => 2,
            "insurance_value" => $validated['insurance_value'] ?? 0,
            "coupon" => null,
            "from_district_id" => $validated['from_district'],
            "to_district_id" => $validated['to_district'],
            "to_ward_code" => $validated['to_ward_code'],
            "height" => $validated['height'] ?? 20,
            "length" => $validated['length'] ?? 20,
            "weight" => $validated['weight'] ?? 1000,
            "width" => $validated['width'] ?? 20,
        ]);
        return response()->json($response->json(), $response->status());
    }
}
