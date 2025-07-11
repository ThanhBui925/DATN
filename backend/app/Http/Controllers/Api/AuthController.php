<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Customer;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Log;
use App\Traits\ApiResponseTrait;

class AuthController extends Controller
{
    use ApiResponseTrait;
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        Log::info('Login attempt', [
            'email' => $credentials['email'],
            'password_length' => strlen($credentials['password'])
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            Log::warning('User not found', ['email' => $credentials['email']]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Log::info('User found', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'user_role' => $user->role,
            'password_hash' => $user->password
        ]);

        if (Hash::check($credentials['password'], $user->password)) {
            Log::info('Password check successful');
            $token = $user->createToken('API Token')->plainTextToken;
            return response()->json(['token' => $token, 'user' => $user], 200);
        } else {
            Log::warning('Password check failed', [
                'provided_password' => $credentials['password'],
                'stored_hash' => $user->password
            ]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|regex:/^0[0-9]{9}$/',
            'address' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'status' => '1',
            'role' => 'client',
        ]);

        $customer = Customer::create([
            'user_id' => $user->id,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        Mail::to($user->email)->queue(new WelcomeMail($user));

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user, 'customer' => $customer], 201);
    }
    public function profile(Request $request) {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse('Người dùng chưa đăng nhập', null, 401);
        }
        if ($user->role == 'client') {
            $user = User::with('customer')->where('id', $user->id)->first();
        }
        return $this->successResponse($user, 'success');
    }
}
