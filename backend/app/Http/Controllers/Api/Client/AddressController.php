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
        $validatedData = $request->validated();
        $userId = $request->user()->id;
        $validatedData['user_id'] = $userId;

        // Check xem địa chỉ này đã tồn tại chưa
        $exists = \App\Models\Address::where('user_id', $userId)
            ->where('address', $validatedData['address'])
            ->where('recipient_phone', $validatedData['recipient_phone'])
            ->where('recipient_name', $validatedData['recipient_name'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Địa chỉ này đã tồn tại.',
            ], 422);
        }

        // Nếu là mặc định thì reset lại
        if ($validatedData['is_default'] ?? false) {
            \App\Models\Address::where('user_id', $userId)
                ->update(['is_default' => false]);
        }

        $address = \App\Models\Address::create($validatedData);
        return $this->successResponse($address, 'Thêm địa chỉ thành công');
    }

    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)->get();
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
