<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class CustomerController extends Controller
{
    use ApiResponseTrait;
    public function index(Request $request)
    {
        $query = DB::table('customers')
            ->join('users', 'customers.user_id', '=', 'users.id')
            ->select(
                'customers.*',
                'users.name as user_name',
                'users.email as user_email',
                'users.role as user_role',
                'users.status as user_status'
            ) ->whereRaw('LOWER(TRIM(users.role)) = ?', ['client']);

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

        if ($request->filled('role')) {
            $query->whereRaw('LOWER(TRIM(users.role)) = ?', [strtolower(trim($request->role))]);
        }

        if ($request->filled('status')) {
            $query->where('users.status', (int) $request->status);
        }

        $customers = $query->orderBy('customers.id', 'desc')->get();

        if ($customers->isEmpty()) {
            return $this->error('Không tìm thấy khách hàng phù hợp.', null, 404);
        }

        return $this->success($customers, 'Danh sách khách hàng đã được lấy thành công.');
    }
    


    public function show($id)
    {
        $customer = Customer::with([
            'user',
            'orders' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'orders.orderItems.product'
        ])->findOrFail($id);

        if (!$customer) {
            return $this->error('Khách hàng không tồn tại.', null, 404);
        }

        return $this->success($customer, 'Chi tiết khách hàng đã được lấy thành công.');
    }

    public function destroy($id)
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return $this->error('Tài khoản user không tồn tại.', null, 404);
        }

        $user = $customer->user;

        // không cho vô hiệu hóa chính mình
        if (auth()->id() === $user->id) {
            return $this->error('Không thể vô hiệu hóa tài khoản của chính mình.', null, 403);
        }

        // không cho vô hiệu hóa super admin
        if ($user->role === 'super_admin') {
            return $this->error('Không thể vô hiệu hóa tài khoản super admin.', null, 403);
        }

        $user->status = $user->status ? 0 : 1;
        $user->save();

        return $this->success(null, $user->status ? 'Tài khoản đã được kích hoạt.' : 'Tài khoản đã bị vô hiệu hóa.');

    }
}
