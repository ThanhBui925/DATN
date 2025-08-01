<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Storage;

class ManagerAdminController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lấy danh sách tài khoản admin với các bộ lọc tương tự CustomerController
     */
    public function index(Request $request)
    {
        $query = DB::table('customers')
            ->join('users', 'customers.user_id', '=', 'users.id')
            ->select(
                'users.id as id',
                'users.name as name',
                'users.email as email',
                'users.role as role',
                'users.status as status',
                'users.created_at as created_at',
                'users.updated_at as updated_at',
                'customers.phone as phone',
                'customers.address as address',
                'customers.dob as dob',
                'customers.gender as gender',
                'customers.avatar as avatar'
            )
            ->where('users.role', 'admin');

        if ($request->filled('phone')) {
            $query->where('customers.phone', 'like', '%' . trim($request->phone) . '%');
        }

        if ($request->filled('address')) {
            $query->where('customers.address', 'like', '%' . trim($request->address) . '%');
        }

        if ($request->filled('gender')) {
            $query->where('customers.gender', trim($request->gender));
        }

        if ($request->filled('name')) {
            $query->where('users.name', 'like', '%' . trim($request->name) . '%');
        }

        if ($request->filled('email')) {
            $query->where('users.email', 'like', '%' . trim($request->email) . '%');
        }

        if ($request->filled('status')) {
            $query->where('users.status', (int) $request->status);
        }

        $admins = $query->orderBy('users.id', 'desc')->get();

        if ($admins->isEmpty()) {
            return $this->error('Không tìm thấy tài khoản admin phù hợp.', null, 404);
        }

        return $this->success($admins, 'Danh sách tài khoản admin đã được lấy thành công.');
    }

    /**
     * Lấy chi tiết tài khoản admin theo id
     */
    public function show($id)
    {
        $admin = User::with('customer')->where('role', 'admin')->find($id);

        if (!$admin) {
            return $this->error('Tài khoản admin không tồn tại.', null, 404);
        }

        $result = [
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => $admin->role,
            'status' => $admin->status,
            'created_at' => $admin->created_at,
            'updated_at' => $admin->updated_at,
            'phone' => $admin->customer->phone ?? null,
            'address' => $admin->customer->address ?? null,
            'dob' => $admin->customer->dob ?? null,
            'gender' => $admin->customer->gender ?? null,
            'avatar' => $admin->customer->avatar ?? null,
        ];

        return $this->success($result, 'Chi tiết tài khoản admin đã được lấy thành công.');
    }

    /**
     * Tạo mới tài khoản admin
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'status' => 'required|in:1,0',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

       
        if ($validator->fails()) {
            return $this->error('Dữ liệu không hợp lệ.', $validator->errors(), 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatar', 'public');
            $avatarUrl = env('APP_URL', 'http://127.0.0.1:8000') . Storage::url($path);
            $data['avatar'] = $avatarUrl;
        }


        $admin = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'admin',
            'status' => $data['status']
        ]);

        if (isset($data['phone']) || isset($data['address']) || isset($data['dob']) || isset($data['gender']) || isset($data['avatar'])) {
            $admin->customer()->create([
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'dob' => $data['dob'] ?? null,
                'gender' => $data['gender'] ?? null,
                'avatar' => $data['avatar'] ?? null,
            ]);
        }

        Log::info('Tạo tài khoản admin mới', ['admin_id' => $admin->id]);

        return $this->success($admin->load('customer'), 'Tạo tài khoản admin thành công.');
    }

    /**
     * Cập nhật tài khoản admin
     */
    public function update(Request $request, $id)
    {
        $admin = User::with('customer')->where('role', 'admin')->find($id);

        if (!$admin) {
            return $this->error('Tài khoản admin không tồn tại.', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
            'status' => 'sometimes|in:active,inactive',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'avatar' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->error('Dữ liệu không hợp lệ.', $validator->errors(), 422);
        }

        $data = $validator->validated();

        $admin->fill($data);

        if (isset($data['password'])) {
            $admin->password = Hash::make($data['password']);
        }

        $admin->save();

        if ($admin->customer) {
            $admin->customer->update([
                'phone' => $data['phone'] ?? $admin->customer->phone,
                'address' => $data['address'] ?? $admin->customer->address,
                'dob' => $data['dob'] ?? $admin->customer->dob,
                'gender' => $data['gender'] ?? $admin->customer->gender,
                'avatar' => $data['avatar'] ?? $admin->customer->avatar,
            ]);
        } else {
            if (isset($data['phone']) || isset($data['address']) || isset($data['dob']) || isset($data['gender']) || isset($data['avatar'])) {
                $admin->customer()->create([
                    'phone' => $data['phone'] ?? null,
                    'address' => $data['address'] ?? null,
                    'dob' => $data['dob'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'avatar' => $data['avatar'] ?? null,
                ]);
            }
        }

        Log::info('Cập nhật tài khoản admin', ['admin_id' => $admin->id]);

        return $this->success($admin->load('customer'), 'Cập nhật tài khoản admin thành công.');
    }

    /**
     * Vô hiệu hóa tài khoản admin (xóa mềm)
     */
    public function destroy($id)
    {
        $admin = User::where('role', 'admin')->find($id);

        if (!$admin) {
            return $this->error('Tài khoản admin không tồn tại.', null, 404);
        }

        if (auth()->id() === $admin->id) {
            return $this->error('Không thể xóa tài khoản của chính mình.', null, 403);
        }

        $admin->status = '0';
        $admin->save();

        Log::info('Vô hiệu hóa tài khoản admin', ['admin_id' => $admin->id]);

        return $this->success(null, 'Tài khoản admin đã bị vô hiệu hóa.');
    }

    /**
     * Khôi phục tài khoản admin đã bị vô hiệu hóa
     */
    public function restore($id)
    {
        $admin = User::where('role', 'admin')->find($id);
        if (!$admin) {
            return $this->error('Tài khoản admin không tồn tại.', null, 404);
        }
        if ($admin->status === '1') {
            return $this->error('Tài khoản admin đã hoạt động.', null, 400);
        }
        $admin->status = '1';
        $admin->save();
        Log::info('Khôi phục tài khoản admin', ['admin_id' => $admin->id]);
        return $this->success(null, 'Tài khoản admin đã được khôi phục.');
    }
}
