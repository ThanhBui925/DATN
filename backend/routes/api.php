<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BannerController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    //Quản lý hoá đơn
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::get('/orders/search', [OrderController::class, 'searchByProduct']);
    Route::get('/orders/{id}/detail', [OrderController::class, 'showDetail']);
    Route::get('/orders/{id}/pdf', [OrderController::class, 'generatePDF']);

    //Quản lý tài khoản người dùng
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::put('/users/{id}/reset-password', [UserController::class, 'resetPassword']);


});