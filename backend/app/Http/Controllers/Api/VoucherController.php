<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        $query = Voucher::query();

        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        $vouchers = $query->get();

        return response()->json([
            'message' => 'Vouchers retrieved successfully',
            'data' => $vouchers,
        ], 200);
    }

    public function show($id)
    {
        $voucher = Voucher::findOrFail($id);

        return response()->json([
            'message' => 'Voucher retrieved successfully',
            'data' => $voucher,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers',
            'discount' => 'required|numeric|min:0',
            'discount_type' => 'required|in:fixed,percentage',
            'expiry_date' => 'nullable|date|after:now',
            'status' => 'nullable|in:0,1',
            'description' => 'required|string',
            'usage_limit' => 'nullable|integer|min:1',
            'product_id' => 'nullable|exists:products,id',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voucher = Voucher::create([
            'code' => $request->code,
            'discount' => $request->discount,
            'discount_type' => $request->discount_type,
            'expiry_date' => $request->expiry_date,
            'status' => $request->status,
            'description' => $request->description,
            'usage_limit' => $request->usage_limit,
            'usage_count' => 0,
            'product_id' => $request->product_id,
            'category_id' => $request->category_id,
        ]);

        return response()->json([
            'message' => 'Voucher created successfully',
            'data' => $voucher,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $voucher = Voucher::findOrFail($id);
        $data = $request->all();

        if (isset($data['usage_limit']) && $data['usage_limit'] === 'null') {
            $data['usage_limit'] = null;
        }

        $validator = Validator::make($data, [
            'code' => 'required|string|max:50|unique:vouchers,code,' . $id,
            'discount' => 'required|numeric|min:0',
            'discount_type' => 'required|in:fixed,percentage',
            'expiry_date' => 'nullable|date|after:now',
            'status' => 'nullable|in:0,1',
            'description' => 'required|string',
            'usage_limit' => 'nullable|integer|min:1',
            'product_id' => 'nullable|exists:products,id',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voucher->update($data);

        return response()->json([
            'message' => 'Voucher updated successfully',
            'data' => $voucher,
        ], 200);
    }


    public function destroy($id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->delete();

        return response()->json([
            'message' => 'Voucher deleted successfully',
        ], 204);
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
                'discount' => $discount,
            ],
        ], 200);
    }
}
