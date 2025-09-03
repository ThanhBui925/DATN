<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Traits\ApiResponseTrait;


class ProfileController extends Controller
{
    use ApiResponseTrait;
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

        $profile = [
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
        ];

        return $this->success($profile, 'Lấy thông tin hồ sơ thành công');
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

            'phone'    => ['nullable', 'regex:/^(0|\+84|84)[0-9]{9}$/'],
            'address'  => ['nullable', 'string', 'max:255'],
            'dob'      => ['nullable', 'date'],
            'gender'   => ['nullable', 'in:male,female,other'],

            'avatar'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
        ], [
            'email.unique'     => 'Email đã tồn tại trong hệ thống.',
            'password.min'     => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'phone.regex'      => 'Số điện thoại không hợp lệ (phải là 10 số và bắt đầu bằng 0 hoặc +84/84).',
            'dob.date'         => 'Ngày sinh phải có định dạng ngày hợp lệ.',
            'gender.in'        => 'Giới tính chỉ được chọn: male, female hoặc other.',
            'avatar.image'     => 'Ảnh đại diện phải là tệp hình ảnh.',
            'avatar.mimes'     => 'Ảnh đại diện chỉ chấp nhận định dạng: jpg, jpeg, png, webp, avif.',
            'avatar.max'       => 'Ảnh đại diện không được vượt quá 2MB.',
        ]);


        // Update user info
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

        $profile = [
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
        ];

        return $this->success($profile, 'Cập nhật hồ sơ thành công');
    }

}
