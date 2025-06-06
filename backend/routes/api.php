<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController; // Đảm bảo đã import UserController
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::prefix('categories')->group(function () {
    Route::get('/trashed', [CategoryController::class, 'trashed']);
    Route::post('/{id}/restore', [CategoryController::class, 'restore']);
    Route::delete('/{id}/force-delete', [CategoryController::class, 'forceDelete']);
    Route::apiResource('categories', CategoryController::class);
});

Route::apiResource('products', ProductController::class);
Route::prefix('products')->group(function () {
    Route::get('/trashed', [ProductController::class, 'trashed']);
    Route::post('/{id}/restore', [ProductController::class, 'restore']);
    Route::delete('/{id}/force-delete', [ProductController::class, 'forceDelete']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']); // Lấy danh sách đơn hàng
        Route::put('/{id}/status', [OrderController::class, 'updateStatus']); // Cập nhật trạng thái đơn hàng
        Route::get('/search', [OrderController::class, 'searchByProduct']); // Tìm kiếm đơn hàng theo sản phẩm
        Route::get('/{id}/detail', [OrderController::class, 'showDetail']); // Xem chi tiết đơn hàng
        Route::get('/{id}/pdf', [OrderController::class, 'generatePDF']); // Tạo PDF hóa đơn
    });
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']); // Lấy danh sách người dùng (có search, filter, paginate)
        Route::put('/{id}/toggle-status', [UserController::class, 'toggleStatus']); // Chuyển đổi trạng thái người dùng (active/inactive)
        Route::put('/{id}/reset-password', [UserController::class, 'resetPassword']); // Đặt lại mật khẩu cho người dùng
    });

});