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
    VoucherController,
    DashboardController,
    ReviewController,
    BlogController
};

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/register', 'register');
    Route::middleware('auth:sanctum')->get('/user', 'user');
});

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/user', [AuthController::class, 'user']);

// Route::middleware('is_admin')->group(function () {
Route::get('/dashboard/total-revenue', [DashboardController::class, 'getTotalRevenue']);
Route::get('/dashboard/total-orders', [DashboardController::class, 'getTotalOrders']);
Route::get('/dashboard/total-customers', [DashboardController::class, 'getTotalCustomers']);
Route::get('/dashboard/average-order-value', [DashboardController::class, 'getAverageOrderValue']);
Route::get('/dashboard/average-rating', [DashboardController::class, 'getAverageRating']);
Route::get('/dashboard/monthly-revenue', [DashboardController::class, 'getMonthlyRevenue']);
Route::get('/dashboard/user-growth', [DashboardController::class, 'getUserGrowth']);
Route::get('/dashboard/revenue-by-category', [DashboardController::class, 'getRevenueByCategory']);
// });

Route::apiResource('banners', BannerController::class);

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
    Route::post('/', 'store');
    Route::get('/search', 'searchByProduct');
    Route::put('/{id}', 'updateStatus');
    Route::get('/{id}', 'show');
    Route::get('/{id}/pdf', 'generatePDF');
});

Route::prefix('users')->controller(UserController::class)->group(function () {
    Route::get('/', 'index');
    Route::put('/{id}/toggle-status', 'toggleStatus');
    Route::put('/{id}/reset-password', 'resetPassword');
    Route::put('/{id}/role', 'updateRole');
});

Route::apiResource('colors', ColorController::class)->only(['index']);
Route::apiResource('colors', ColorController::class)->only(['store', 'update', 'destroy']);

Route::apiResource('sizes', SizeController::class)->only(['index']);
Route::apiResource('sizes', SizeController::class)->only(['store', 'update', 'destroy']);

Route::prefix('vouchers')->controller(VoucherController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/apply', 'apply');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::prefix('reviews')->controller(ReviewController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
    Route::post('/{id}/reply', 'reply');
});

Route::prefix('blogs')->controller(BlogController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::put('/{id}/hide', 'hide');
    Route::get('/{id}', 'show');
    Route::delete('/{id}', 'destroy');

    // Bình luận blog
    Route::get('/{blogId}/comments', 'comments');
    Route::post('/{blogId}/comments', 'storeComment');
    Route::delete('/comments/{commentId}', 'softDeleteComment');
    Route::put('/comments/{commentId}/restore', 'restoreComment');
});

// });
