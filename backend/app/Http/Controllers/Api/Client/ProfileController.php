<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
                'avatar'     => optional($customer)->avatar,
                'avatar_url' => $avatarUrl,
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
            'name'     => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],

            'phone'    => ['nullable', 'string', 'max:20'],
            'address'  => ['nullable', 'string', 'max:255'],
            'dob'      => ['nullable', 'date'],
            'gender'   => ['nullable', 'in:male,female,other'],

            'avatar'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
        ]);

        // Update users
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['email'])) {
            $user->email = $data['email'];
        }
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();


        $customer = $user->customer;
        $newAvatarPath = $customer?->avatar;

        // Nếu upload avatar mới
        if ($request->hasFile('avatar')) {
            $avatarFile = $request->file('avatar');

            Log::info('Avatar received: ' . $avatarFile->getClientOriginalName());
            Log::info('Avatar size: ' . $avatarFile->getSize() . ' bytes');
            Log::info('Avatar mime type: ' . $avatarFile->getMimeType());

            if ($avatarFile->isValid()) {
                // Lưu avatar mới
                $storedPath = $avatarFile->store("avatars/{$user->id}", 'public');
                $newAvatarPath = env('APP_URL', "http://127.0.0.1:8000") . Storage::url($storedPath);

                Log::info('New avatar path: ' . $newAvatarPath);

                // Xóa avatar cũ nếu có
                if ($customer && $customer->avatar) {
                    $oldImagePath = str_replace(env('APP_URL', "http://127.0.0.1:8000") . '/storage/', '', $customer->avatar);
                    if (Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
            } else {
                Log::error('Invalid avatar uploaded');
                $newAvatarPath = $customer?->avatar; // Giữ ảnh cũ nếu file không hợp lệ
            }
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
