<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Traits\ApiResponseTrait;
class VoucherController extends Controller
{
    use ApiResponseTrait;
    public function index(Request $request)
    {
        $query = Voucher::query();

        // Lọc theo trạng thái
        if ($request->has('status')) {
            $status = $request->input('status');
            if (in_array($status, [0, 1])) {
                $query->where('status', $status);
            }
        }
        // Lọc theo loại giảm giá
        if ($request->has('discount_type')) {
            $discountType = $request->input('discount_type');
            if (in_array($discountType, ['fixed', 'percentage'])) {
                $query->where('discount_type', $discountType);
            }
        }
        // Lọc theo mã voucher
        if ($request->has('code')) {
            $code = $request->input('code');
            $query->where('code', 'like', '%' . $code . '%');
        }
        // Lọc theo ngày hết hạn
        if ($request->has('expiry_date')) {
            $expiryDate = $request->input('expiry_date');
            $query->whereDate('expiry_date', $expiryDate);
        }
        // Lọc theo ngày tạo
        if ($request->has('created_at')) {
            $createdAt = $request->input('created_at');
            $query->whereDate('created_at', $createdAt);
        }
        // Lọc theo người dùng
        if ($request->has('user_id')) {
            $userId = $request->input('user_id');
            $query->where('user_id', $userId);
        }

        $vouchers = $query->get();

        return $this->success($vouchers, 'Lấy danh sách voucher thành công');
    }


    public function show($id)
    {
        $voucher = Voucher::with(['user'])->find($id);

        if (!$voucher) {
            return $this->error('Không tìm thấy voucher', null, 404);
        }

        return $this->success($voucher, 'Lấy voucher thành công');
    }



    public function store(StoreVoucherRequest $request)
    {
        return $this->success(Voucher::create($request->all()), 'Tạo mới voucher thành công', 201);
    }

    public function update(UpdateVoucherRequest $request, $id)
    {
        $voucher = Voucher::findOrFail($id);
        return $this->success($voucher->update($request->all()), 'Cập nhật voucher thành công', 200);
    }

    public function destroy($id)
    {
        $voucher = Voucher::find($id);

        if (!$voucher) {
            return response()->json([
                'message' => 'Voucher not found'
            ], 404);
        }

        $voucher->delete();

        return $this->success(null, 'Xóa voucher thành công', 204);

    }

    public function apply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|exists:vouchers,code',
            'user_id' => 'required|exists:users,id',
            'order_items' => 'required|array',
            'order_items.*.product_id' => 'required|exists:products,id',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voucher = Voucher::where('code', $request->code)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expiry_date')
                    ->orWhere('expiry_date', '>=', Carbon::now());
            })
            ->first();

        if (!$voucher) {
            return response()->json(['message' => 'Invalid or expired voucher'], 400);
        }

        if ($voucher->usage_limit && $voucher->usage_count >= $voucher->usage_limit) {
            return response()->json(['message' => 'Voucher has reached usage limit'], 400);
        }

        $applicable_total = 0;
        foreach ($request->order_items as $item) {
            $product = Product::find($item['product_id']);
            if (
                ($voucher->product_id && $voucher->product_id == $product->id) ||
                ($voucher->category_id && $product->category_id == $voucher->category_id) ||
                (!$voucher->product_id && !$voucher->category_id)
            ) {
                $applicable_total += $item['price'] * $item['quantity'];
            }
        }

        if ($applicable_total == 0) {
            return response()->json(['message' => 'Voucher not applicable to any items in cart'], 400);
        }

        if ($voucher->discount_type === 'fixed' && $voucher->discount > $applicable_total) {
            return response()->json([
                'message' => 'Discount amount cannot exceed the applicable order total.'
            ], 400);
        }

        $discount = $voucher->discount_type === 'percentage'
            ? $applicable_total * ($voucher->discount / 100)
            : min($voucher->discount, $applicable_total);

        VoucherUser::create([
            'voucher_id' => $voucher->id,
            'user_id' => $request->user_id,
            'order_id' => null,
        ]);

        $voucher->increment('usage_count');

        return response()->json([
            'message' => 'Voucher applied successfully',
            'data' => [
                'voucher' => $voucher,
                'discount' => round($discount, 2),
            ],
        ], 200);
    }
}
