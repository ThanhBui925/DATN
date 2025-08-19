<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        return response()->json([
            'profile' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'status'  => $user->status,
                'phone'   => optional($customer)->phone,
                'address' => optional($customer)->address,
                'avatar'  => optional($customer)->avatar,
                'dob'     => optional($customer)->dob,
                'gender'  => optional($customer)->gender,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],

            // validate thêm cho customer
            'phone'    => ['nullable', 'string', 'max:20'],
            'address'  => ['nullable', 'string', 'max:255'],
            'avatar'   => ['nullable', 'string', 'max:255'],
            'dob'      => ['nullable', 'date'],
            'gender'   => ['nullable', 'in:male,female,other'],
        ]);

        // update bảng users
        $user->name  = $data['name'];
        $user->email = $data['email'];

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        // update bảng customers (nếu chưa có thì tạo mới)
        $user->customer()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone'   => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'avatar'  => $data['avatar'] ?? null,
                'dob'     => $data['dob'] ?? null,
                'gender'  => $data['gender'] ?? null,
            ]
        );

        $customer = $user->customer;

        return response()->json([
            'profile' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'status'  => $user->status,
                'phone'   => optional($customer)->phone,
                'address' => optional($customer)->address,
                'avatar'  => optional($customer)->avatar,
                'dob'     => optional($customer)->dob,
                'gender'  => optional($customer)->gender,
                'updated_at' => optional($user->updated_at)->toDateTimeString(),
            ]
        ]);
    }
}
