<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    BannerController,
    CategoryController,
    ProductController,
    OrderController,
    UserController,
    ColorController,
    SizeController
};

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/register', 'register');
    Route::middleware('auth:sanctum')->get('/user', 'user');
});

// Route::middleware('auth:sanctum')->group(function () {ss

    Route::apiResource('banners', BannerController::class)->only([
        'index', 'store', 'update', 'destroy'
    ]);

    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::get('/trashed', 'trashed');
        Route::post('{id}/restore', 'restore');
        Route::delete('{id}/force-delete', 'forceDelete');
        Route::apiResource('/', CategoryController::class)->parameter('', 'category');
    });

    Route::prefix('products')->controller(ProductController::class)->group(function () {
        Route::get('/trashed', 'trashed');
        Route::post('{id}/restore', 'restore');
        Route::delete('{id}/force-delete', 'forceDelete');
        Route::apiResource('/', ProductController::class)->parameter('', 'product');
    });

    Route::prefix('orders')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/search', 'searchByProduct');
        Route::put('/{id}/status', 'updateStatus');
        Route::get('/{id}/detail', 'showDetail');
        Route::get('/{id}/pdf', 'generatePDF');
    });

    Route::prefix('customers')->controller(UserController::class)->group(function () {
        Route::get('/', 'index');
        Route::put('/{id}/toggle-status', 'toggleStatus');
        Route::put('/{id}/reset-password', 'resetPassword');
    });

    Route::apiResource('colors', ColorController::class);
    Route::apiResource('sizes', SizeController::class);

