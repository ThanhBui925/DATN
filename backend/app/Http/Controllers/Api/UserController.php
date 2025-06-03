<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['roles', 'customer']);

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('role')) {
            $roleSlugs = (array) $request->input('role');
            $query->whereHas('roles', function ($q) use ($roleSlugs) {
                $q->whereIn('slug', $roleSlugs);
            });
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'message' => 'Người dùng lấy lại thành công',
            'users' => $users->items(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'total' => $users->total()
        ], 200);
    }

    public function toggleStatus(Request $request, $id)
    {
        $currentUser = auth()->user();

        if (!$currentUser || $currentUser->roles->where('slug', 'admin')->isEmpty()) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->save();

        return response()->json([
            'message' => 'Trạng thái người dùng đã được cập nhật',
            'user' => $user
        ], 200);
    }

    public function resetPassword(Request $request, $id)
    {
        $currentUser = auth()->user();

        // Kiểm tra quyền (chỉ admin có thể đặt lại mật khẩu cho người khác)
        if (!$currentUser || $currentUser->roles->where('slug', 'admin')->isEmpty()) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Validate request
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->input('password'));
        $user->save();

        return response()->json([
            'message' => 'Mật khẩu đã được đặt lại thành công',
            'user' => $user
        ], 200);
    }
}