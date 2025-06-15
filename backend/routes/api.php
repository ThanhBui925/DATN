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
    SizeController,
    DashboardController
};

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/register', 'register');
    Route::middleware('auth:sanctum')->get('/user', 'user');
});

Route::middleware('auth:sanctum')->group(function () {

    // Dashboard routes
    Route::get('/dashboard/total-revenue', [DashboardController::class, 'getTotalRevenue']);
    Route::get('/dashboard/total-orders', [DashboardController::class, 'getTotalOrders']);
    Route::get('/dashboard/total-customers', [DashboardController::class, 'getTotalCustomers']);
    Route::get('/dashboard/average-order-value', [DashboardController::class, 'getAverageOrderValue']);
    Route::get('/dashboard/average-rating', [DashboardController::class, 'getAverageRating']);
    Route::get('/dashboard/monthly-revenue', [DashboardController::class, 'getMonthlyRevenue']);
    Route::get('/dashboard/user-growth', [DashboardController::class, 'getUserGrowth']);
    Route::get('/dashboard/revenue-by-category', [DashboardController::class, 'getRevenueByCategory']);

    // Banners
    Route::apiResource('banners', BannerController::class);

    // Categories
    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::get('/trashed', 'trashed');
        Route::post('{id}/restore', 'restore');
        Route::delete('{id}/force-delete', 'forceDelete');
        Route::apiResource('/', CategoryController::class)->parameter('', 'category');
    });

    // Products
    Route::prefix('products')->controller(ProductController::class)->group(function () {
        Route::get('/trashed', 'trashed');
        Route::post('{id}/restore', 'restore');
        Route::delete('{id}/force-delete', 'forceDelete');
        Route::apiResource('/', ProductController::class)->parameter('', 'product');
    });

    // Orders
    Route::prefix('orders')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/search', 'searchByProduct');
        Route::put('/{id}/status', 'updateStatus');
        Route::get('/{id}/detail', 'showDetail');
        Route::get('/{id}/pdf', 'generatePDF');
    });

    // Users
    Route::prefix('users')->controller(UserController::class)->group(function () {
        Route::get('/', 'index');
        Route::put('/{id}/toggle-status', 'toggleStatus');
        Route::put('/{id}/reset-password', 'resetPassword');
        Route::put('/{id}/role', 'updateRole');
    });

    // Colors & Sizes
    Route::apiResource('colors', ColorController::class);
    Route::apiResource('sizes', SizeController::class);
});
