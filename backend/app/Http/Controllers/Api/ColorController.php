<?php

// app/Http/Controllers/ColorController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    // Lấy danh sách màu sắc
    public function index()
    {
        return response()->json(Color::all());
    }

    // Tạo màu sắc mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $color = Color::create([
            'name' => $request->name,
        ]);

        return response()->json($color, 201);
    }

    // Lấy chi tiết màu sắc
    public function show($id)
    {
        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        return response()->json($color);
    }

    // Cập nhật màu sắc
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        $color->name = $request->name;
        $color->save();

        return response()->json($color);
    }

    // Xóa màu sắc
    public function destroy($id)
    {
        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        // Kiểm tra xem có bản ghi variant_products nào tham chiếu đến color này không
        $hasVariants = \DB::table('variant_products')->where('color_id', $id)->exists();

        if ($hasVariants) {
            return response()->json([
                'message' => 'Cannot delete color because it is used in variant products.'
            ], 400);
        }

        $color->delete();

        return response()->json(['message' => 'Color deleted']);
    }

}
