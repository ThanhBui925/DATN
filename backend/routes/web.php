<?php

use Illuminate\Support\Facades\Route;

// Swagger UI Route đã được L5-Swagger tự động đăng ký tại /api/documentation
use Illuminate\Http\Request;
use App\Http\Controllers\VNPayController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/reset-password', function (Request $request) {
    return view('emails.reset-password', [
        'token' => $request->query('token'),
        'email' => $request->query('email'),
    ]);
})->name('password.reset');

// Route cho VNPay
Route::get('/payment-return', [VNPayController::class, 'paymentReturn']);
