<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = auth()->user();

        if(!$currentUser || !$currentUser->isAdmin()){
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này.'
            ], 403);
        }

        $query = User::with(['customer']);

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'message' => 'Danh sách người dùng đã được lấy thành công.',
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ], 200);
    }

    public function toggleStatus(Request $request, $id)
    {
        $currentUser = auth()->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này.'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        if ($currentUser->id === $user->id) {
            return response()->json([
                'message' => 'Bạn không thể thay đổi trạng thái của tài khoản của chính mình.'
            ], 403);
        }

        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->save();

        return response()->json([
            'message' => 'Trạng thái người dùng đã được cập nhật thành công.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
            ]
        ], 200);
    }

    public function resetPassword(Request $request, $id)
    {
        $currentUser = auth()->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này.'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        if ($currentUser->id === $user->id) {
            return response()->json([
                'message' => 'Bạn không thể đặt lại mật khẩu của tài khoản của chính mình bằng chức năng này.'
            ], 403);
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
        ]);

        $user->password = Hash::make($request->input('password'));
        $user->save();

        return response()->json([
            'message' => 'Mật khẩu đã được đặt lại thành công.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }

    public function updateRole(Request $request, $id)
    {
        \Log::info('UpdateRole Request:', [
            'data' => $request->all(),
            'headers' => $request->headers->all()
        ]);
        $user = User::findOrFail($id);

        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $request->validate([
            'role' => 'required|in:admin,client'
        ]);

        $user->role = $request->role;
        $user->save();
        return response()->json(['message' => 'Role updated successfully', 'user' => $user]);
    }
}