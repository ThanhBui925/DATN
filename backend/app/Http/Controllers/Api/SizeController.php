<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    // Lấy danh sách tất cả size
    public function index()
    {
        return response()->json(Size::all());
    }

    // Tạo size mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $size = Size::create([
            'name' => $request->name,
        ]);

        return response()->json($size, 201);
    }

    // Lấy chi tiết size theo id
    public function show($id)
    {
        $size = Size::find($id);

        if (!$size) {
            return response()->json(['message' => 'Size not found'], 404);
        }

        return response()->json($size);
    }

    // Cập nhật size
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $size = Size::find($id);

        if (!$size) {
            return response()->json(['message' => 'Size not found'], 404);
        }

        $size->name = $request->name;
        $size->save();

        return response()->json($size);
    }

    // Xóa size
    public function destroy($id)
    {
        $size = Size::find($id);

        if (!$size) {
            return response()->json(['message' => 'Size not found'], 404);
        }

        // Kiểm tra ràng buộc ở bảng variant_products
        $hasVariants = \DB::table('variant_products')->where('size_id', $id)->exists();
        
        if ($hasVariants) {
            return response()->json([
                'message' => 'Cannot delete size because it is used in variant products.'
            ], 400);
        }

        $size->delete();

        return response()->json(['message' => 'Size deleted']);
    }


}
