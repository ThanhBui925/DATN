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
    VoucherController
};

// Route công khai (không cần middleware)
Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/register', 'register');
});

// Route yêu cầu xác thực
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', [AuthController::class, 'user']);

    // Banners (admin chỉ được store, update, destroy)
    Route::apiResource('banners', BannerController::class)->only(['index']);
    Route::middleware('is_admin')->apiResource('banners', BannerController::class)->only(['store', 'update', 'destroy']);

    // Categories
    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{category}', 'show');
        Route::middleware('is_admin')->group(function () {
            Route::post('/', 'store');
            Route::put('/{category}', 'update');
            Route::delete('/{category}', 'destroy');
            Route::get('/trashed', 'trashed');
            Route::post('/{id}/restore', 'restore');
            Route::delete('/{id}/force-delete', 'forceDelete');
        });
    });

    // Products
    Route::prefix('products')->controller(ProductController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{product}', 'show');
        Route::middleware('is_admin')->group(function () {
            Route::post('/', 'store');
            Route::put('/{product}', 'update');
            Route::delete('/{product}', 'destroy');
            Route::get('/trashed', 'trashed');
            Route::post('/{id}/restore', 'restore');
            Route::delete('/{id}/force-delete', 'forceDelete');
        });
    });

    // Orders
    Route::prefix('orders')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/search', 'searchByProduct');
        Route::get('/{id}/detail', 'showDetail');
        Route::get('/{id}/pdf', 'generatePDF');
        Route::middleware('is_admin')->put('/{id}/status', 'updateStatus');
    });

    // Customers (admin only)
    Route::prefix('customers')->controller(UserController::class)->middleware('is_admin')->group(function () {
        Route::get('/', 'index');
        Route::put('/{id}/toggle-status', 'toggleStatus');
        Route::put('/{id}/reset-password', 'resetPassword');
    });

    // Colors (admin quản lý, khách hàng xem)
    Route::apiResource('colors', ColorController::class)->only(['index']);
    Route::middleware('is_admin')->apiResource('colors', ColorController::class)->only(['store', 'update', 'destroy']);

    // Sizes (admin quản lý, khách hàng xem)
    Route::apiResource('sizes', SizeController::class)->only(['index']);
    Route::middleware('is_admin')->apiResource('sizes', SizeController::class)->only(['store', 'update', 'destroy']);

    // Vouchers
    Route::prefix('vouchers')->controller(VoucherController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/apply', 'apply');
        Route::middleware('is_admin')->group(function () {
            Route::post('/', 'store');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });
    });
});
