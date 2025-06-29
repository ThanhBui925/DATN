<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Mail\PasswordResetSuccessMail;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordLinkMail;

class ForgotPasswordController extends Controller
{
    // Gửi email chứa token reset
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = \App\Models\User::where('email', $request->email)->first();
        $token = Password::createToken($user); // tạo token

        // Gửi mail qua queue với nội dung custom
        Mail::to($user->email)->queue(new ResetPasswordLinkMail($user, $token));

        return response()->json([
            'status' => true,
            'message' => 'Đã gửi link đặt lại mật khẩu qua email.'
        ]);
    }

    // Đặt lại mật khẩu mới
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
                Mail::to($user->email)->queue(new PasswordResetSuccessMail($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['status' => true, 'message' => 'Đặt lại mật khẩu thành công.']);
        }

        return response()->json(['status' => false, 'message' => 'Token không hợp lệ hoặc đã hết hạn.'], 400);
    }
}
