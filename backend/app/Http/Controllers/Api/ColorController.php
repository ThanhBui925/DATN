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
            'name' => 'required|string|max:50|unique:colors,name',
        ], [
            'name.required' => 'Vui lòng nhập tên màu sắc.',
            'name.max' => 'Tên màu sắc không được vượt quá :max ký tự.',
            'name.unique' => 'Tên màu sắc đã tồn tại.',
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
            return response()->json(['message' => 'Màu sắc không tồn tại'], 404);
        }

        return response()->json($color);
    }

    // Cập nhật màu sắc
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:colors,name,' . $id,
        ], [
            'name.required' => 'Vui lòng nhập tên màu sắc.',
            'name.max' => 'Tên màu sắc không được vượt quá :max ký tự.',
            'name.unique' => 'Tên màu sắc đã tồn tại.',
        ]);

        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Màu sắc không tồn tại'], 404);
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
            return response()->json(['message' => 'Màu sắc không tồn tại'], 404);
        }

        // Kiểm tra xem có bản ghi variant_products nào tham chiếu đến color này không
        $hasVariants = \DB::table('variant_products')->where('color_id', $id)->exists();

        if ($hasVariants) {
            return response()->json([
                'message' => 'Không thể xóa màu sắc này vì đã có sản phẩm sử dụng màu này.'
            ], 400);
        }

        $color->delete();

        return response()->json(['message' => 'Xóa màu sắc thành công.']);
    }

}
