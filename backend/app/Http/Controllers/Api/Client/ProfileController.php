<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Xem thông tin profile
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        // Xử lý avatar_url (public URL)
        $avatarUrl = $customer?->avatar
            ? Storage::disk('public')->url($customer->avatar)
            : null;

        return response()->json([
            'profile' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'status'     => $user->status,
                'phone'      => optional($customer)->phone,
                'address'    => optional($customer)->address,
                'avatar'     => optional($customer)->avatar,   // path lưu trong DB
                'avatar_url' => $avatarUrl,                    // URL public cho FE
                'dob'        => optional($customer)->dob,
                'gender'     => optional($customer)->gender,
            ]
        ]);
    }

    /**
     * Cập nhật thông tin profile + avatar
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],

            // customer
            'phone'    => ['nullable', 'string', 'max:20'],
            'address'  => ['nullable', 'string', 'max:255'],
            'dob'      => ['nullable', 'date'],
            'gender'   => ['nullable', 'in:male,female,other'],

            // avatar file
            'avatar'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
        ]);

        // Update users
        $user->name  = $data['name'];
        $user->email = $data['email'];
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        $customer = $user->customer;
        $newAvatarPath = $customer?->avatar;

        // Nếu upload avatar mới
        if ($request->hasFile('avatar')) {
            // xóa avatar cũ nếu có (nằm trong storage)
            if ($customer && $customer->avatar && Storage::disk('public')->exists($customer->avatar)) {
                Storage::disk('public')->delete($customer->avatar);
            }

            // lưu avatar mới vào storage/app/public/avatars/{user_id}/...
            $newAvatarPath = $request->file('avatar')->store("avatars/{$user->id}", 'public');
        }

        // Update hoặc tạo customer
        $user->customer()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone'   => $data['phone']   ?? null,
                'address' => $data['address'] ?? null,
                'avatar'  => $newAvatarPath,
                'dob'     => $data['dob']     ?? null,
                'gender'  => $data['gender']  ?? null,
            ]
        );

        $customer = $user->fresh()->customer;
        $avatarUrl = $customer?->avatar
            ? Storage::disk('public')->url($customer->avatar)
            : null;

        return response()->json([
            'profile' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'status'     => $user->status,
                'phone'      => $customer?->phone,
                'address'    => $customer?->address,
                'avatar'     => $customer?->avatar,
                'avatar_url' => $avatarUrl,
                'dob'        => $customer?->dob,
                'gender'     => $customer?->gender,
                'updated_at' => optional($user->updated_at)->toDateTimeString(),
            ]
        ]);
    }
}
