<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use App\Http\Requests\StoreAddressRequest;
use App\Traits\ApiResponseTrait;

class AddressController extends Controller
{
    use ApiResponseTrait;
    public function store(StoreAddressRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $validated['user_id'] = $user->id;

        $isDuplicate = Address::where('user_id', $user->id)
            ->where('address', $validated['address'])
            ->where('recipient_name', $validated['recipient_name'])
            ->where('recipient_phone', $validated['recipient_phone'])
            ->exists();

        if ($isDuplicate) {
            return response()->json([
                'message' => 'Địa chỉ này đã tồn tại.',
            ], 422);
        }

        if (!empty($validated['is_default'])) {
            Address::where('user_id', $user->id)->update(['is_default' => false]);
        }

        $address = Address::create($validated);

        return $this->successResponse($address, 'Thêm địa chỉ thành công');
    }

    public function index(Request $request)
    {
        $address = Address::where('user_id', $request->user()->id)->get();

        $addresses = $address->map(function ($address) {
            return [
                'id' => $address->id,
                'recipient_name' => $address->recipient_name,
                'recipient_phone' => $address->recipient_phone,
                'recipient_email' => $address->recipient_email,
                'address' => $address->address,
                'ward_name' => $address->ward_name,
                'district_name' => $address->district_name,
                'province_name' => $address->province_name,
                'is_default' => $address->is_default,
                'full_address' => implode(', ', array_filter([
                    $address->address,
                    $address->ward_name,
                    $address->district_name,
                    $address->province_name,
                ])),
            ];
        });

        return $this->successResponse($addresses, 'Addresses retrieved successfully');
    }


    public function update(StoreAddressRequest $request, $id)
    {
        $address = Address::findOrFail($id);
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validated();

        // Check xem địa chỉ này đã tồn tại chưa
        $exists = Address::where('user_id', $request->user()->id)
            ->where('address', $validatedData['address'])
            ->where('recipient_phone', $validatedData['recipient_phone'])
            ->where('recipient_name', $validatedData['recipient_name'])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Địa chỉ này đã tồn tại.',
            ], 422);
        }

        // Nếu là mặc định thì reset lại
        if ($validatedData['is_default'] ?? false) {
            Address::where('user_id', $request->user()->id)
                ->update(['is_default' => false]);
        }

        $address->update($validatedData);
        return $this->successResponse($address, 'Cập nhật địa chỉ thành công');
    }

    public function destroy(Request $request, $id)
    {
        $address = Address::findOrFail($id);
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        
        if ($address->is_default) {
            return response()->json(['message' => 'Không thể xóa địa chỉ mặc định'], 422);
        }

        $address->delete();
        return $this->successResponse(null, 'Xóa địa chỉ thành công');
    }
}
