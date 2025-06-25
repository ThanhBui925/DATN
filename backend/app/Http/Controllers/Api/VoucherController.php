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
class VoucherController extends Controller
{
    public function index(Request $request)
    {
        $query = Voucher::query();

        if ($request->has('product_id')) {
            $query->whereHas('products', function ($q) use ($request) {
                $q->where('product_id', $request->input('product_id'));
            });
        }

        if ($request->has('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('category_id', $request->input('category_id'));
            });
        }

        $vouchers = $query->get();

        return response()->json([
            'message' => 'Vouchers retrieved successfully',
            'data' => $vouchers,
        ], 200);
    }


    public function show($id)
    {
        $voucher = Voucher::with(['products', 'categories', 'user'])->findOrFail($id);

        return response()->json([
            'message' => 'Voucher retrieved successfully',
            'data' => $voucher,
        ], 200);
    }




    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers',
            'discount_type' => ['required', Rule::in(['fixed', 'percentage'])],
            'discount' => [
                'required',
                'numeric',
                'min:0.01',
                Rule::when($request->discount_type === 'percentage', 'max:100'),
                Rule::when($request->discount_type === 'fixed', 'max:1000000'),
            ],
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date|after:now',
            'status' => 'nullable|in:0,1',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'applies_to' => ['required', Rule::in(['all', 'product', 'category'])],

            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',

            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voucher = Voucher::create([
            'code' => $request->code,
            'discount_type' => $request->discount_type,
            'discount' => $request->discount,
            'max_discount_amount' => $request->max_discount_amount,
            'min_order_amount' => $request->min_order_amount,
            'expiry_date' => $request->expiry_date,
            'status' => $request->status ?? 1,
            'description' => $request->description,
            'usage_limit' => $request->usage_limit,
            'usage_limit_per_user' => $request->usage_limit_per_user,
            'usage_count' => 0,
            'is_public' => 1,
            'applies_to' => $request->applies_to,
        ]);

        // Gán sản phẩm nếu có
        if ($request->filled('product_ids') && $request->applies_to === 'product') {
            $voucher->products()->sync($request->product_ids);
        }

        // Gán danh mục nếu có
        if ($request->filled('category_ids') && $request->applies_to === 'category') {
            $voucher->categories()->sync($request->category_ids);
        }

        return response()->json([
            'message' => 'Voucher created successfully',
            'data' => $voucher->load('products', 'categories'),
        ], 201);
    }



    public function update(Request $request, $id)
    {
        $voucher = Voucher::findOrFail($id);

        // Bổ sung các trường từ DB nếu không gửi từ request
        $request->merge([
            'code' => $request->input('code', $voucher->code),
            'discount_type' => $request->input('discount_type', $voucher->discount_type),
            'discount' => $request->input('discount', $voucher->discount),
            'max_discount_amount' => $request->input('max_discount_amount', $voucher->max_discount_amount),
            'min_order_amount' => $request->input('min_order_amount', $voucher->min_order_amount),
            'expiry_date' => $request->input('expiry_date', $voucher->expiry_date),
            'status' => $request->input('status', $voucher->status),
            'usage_limit' => $request->input('usage_limit', $voucher->usage_limit),
            'usage_limit_per_user' => $request->input('usage_limit_per_user', $voucher->usage_limit_per_user),
            'applies_to' => $request->input('applies_to', $voucher->applies_to),
        ]);

        $discountType = $request->input('discount_type');
        $appliesTo = $request->input('applies_to');

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers,code,' . $voucher->id,
            'discount_type' => ['required', Rule::in(['fixed', 'percentage'])],
            'discount' => [
                'required',
                'numeric',
                'min:0.01',
                Rule::when($discountType === 'percentage', 'max:100'),
                Rule::when($discountType === 'fixed', 'max:1000000'),
            ],
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date|after:now',
            'status' => 'nullable|in:0,1',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'applies_to' => ['required', Rule::in(['all', 'product', 'category'])],

            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cập nhật dữ liệu
        $voucher->update([
            'code' => $request->input('code'),
            'discount_type' => $discountType,
            'discount' => $request->input('discount'),
            'max_discount_amount' => $request->input('max_discount_amount'),
            'min_order_amount' => $request->input('min_order_amount'),
            'expiry_date' => $request->input('expiry_date'),
            'status' => $request->input('status'),
            'description' => $request->input('description'),
            'usage_limit' => $request->input('usage_limit'),
            'usage_limit_per_user' => $request->input('usage_limit_per_user'),
            'applies_to' => $appliesTo,
        ]);

        // Cập nhật liên kết
        if ($appliesTo === 'product') {
            $voucher->products()->sync($request->input('product_ids', []));
            $voucher->categories()->detach();
        } elseif ($appliesTo === 'category') {
            $voucher->categories()->sync($request->input('category_ids', []));
            $voucher->products()->detach();
        } else {
            $voucher->products()->detach();
            $voucher->categories()->detach();
        }

        return response()->json([
            'message' => 'Voucher updated successfully',
            'data' => $voucher->load('products', 'categories'),
        ], 200);
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

        return response()->json([
            'message' => 'Voucher deleted successfully',
        ], 200);
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
