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
    BlogController,
    CartController,
    CustomerController,
    ForgotPasswordController,
    ManagerAdminController

};
use App\Http\Controllers\Api\Client\ProductController as ClientProductController;
use App\Http\Controllers\Api\Client\CategoryController as ClientCategoryController;
use App\Http\Controllers\Api\Client\CartController as ClientCartController;
use App\Http\Controllers\Api\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Api\Client\ReviewController as ClientReviewController;
use App\Http\Controllers\Api\Client\AddressController;
use App\Http\Controllers\Api\Client\ShippingFeeController;


Route::prefix('client')->group(function () {
    // Các route public (không cần đăng nhập)
    Route::get('/new-arrival-product', [ClientProductController::class, 'newArrivalProduct']);
    Route::get('/best-seller-product', [ClientProductController::class, 'bestSellerProduct']);
    // Route::get('/feature-product', [ClientProductController::class, 'featureProduct']);
    Route::prefix('products')->group(function () {
        Route::get('/', [ClientProductController::class, 'getAllProducts']);
        Route::get('/{id}', [ClientProductController::class, 'show']);
    });
    Route::prefix('categories')->group(function () {
        Route::get('/', [ClientCategoryController::class, 'index']);
        Route::get('/{id}', [ClientCategoryController::class, 'show']);
    });

    Route::prefix('banners')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\Client\BannerController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\Client\BannerController::class, 'show']);
    });
    Route::get('/products/{id}/reviews', [ClientProductController::class, 'getReviewsByProduct']);


    Route::middleware('auth:sanctum')->post('/shipping-fee', [ShippingFeeController::class, 'calculate']);

    // Các route cần đăng nhập
    Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
        Route::get('/', [ClientCartController::class, 'index']);
        Route::post('/items', [ClientCartController::class, 'store']);
        Route::put('/items/{itemId}', [ClientCartController::class, 'update']);
        Route::delete('/items/{itemId}', [ClientCartController::class, 'destroy']);
        Route::get('/{productId}/variants', [ClientCartController::class, 'getProductVariants']);
    });
    Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
        Route::get('/', [ClientOrderController::class, 'index']);
        Route::post('/', [ClientOrderController::class, 'store']);
        Route::get('/{id}', [ClientOrderController::class, 'show']);
        Route::put('/{id}/cancel', [ClientOrderController::class, 'cancel']);
        Route::put('/{id}/address', [ClientOrderController::class, 'updateAddress']);
        Route::get('/{id}/retry', [ClientOrderController::class, 'retryVNPay']);
    });

    Route::middleware('auth:sanctum')->prefix('reviews')->group(function () {
        Route::get('/', [ClientReviewController::class, 'index']);
        Route::post('/', [ClientReviewController::class, 'store']);
        Route::put('/{id}', [ClientReviewController::class, 'update']);
        Route::delete('/{id}', [ClientReviewController::class, 'destroy']);
    });
    Route::middleware('auth:sanctum')->post('/checkout/apply_coupon', [ClientOrderController::class, 'applyVoucher']);
    Route::middleware('auth:sanctum')->prefix('addresses')->group(function () {
        Route::post('/', [AddressController::class, 'store']);
        Route::get('/', [AddressController::class, 'index']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
    });

});

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/register', 'register');
    Route::get('/user', 'user');
    Route::get('/profile', 'profile')->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});





Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::get('/dashboard/total-revenue', [DashboardController::class, 'getTotalRevenue']);
Route::get('/dashboard/total-orders', [DashboardController::class, 'getTotalOrders']);
Route::get('/dashboard/total-customers', [DashboardController::class, 'getTotalCustomers']);
Route::get('/dashboard/average-order-value', [DashboardController::class, 'getAverageOrderValue']);
Route::get('/dashboard/average-rating', [DashboardController::class, 'getAverageRating']);
Route::get('/dashboard/monthly-revenue', [DashboardController::class, 'getMonthlyRevenue']);
Route::get('/dashboard/user-growth', [DashboardController::class, 'getUserGrowth']);
Route::get('/dashboard/revenue-by-category', [DashboardController::class, 'getRevenueByCategory']);

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

Route::apiResource('customers', CustomerController::class)->only([
    'index',
    'store',
    'update',
    'destroy',
    'show'
]);

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


Route::prefix('manager-admin')->controller(ManagerAdminController::class)->group(function(){
    Route::get('/','index');
    Route::post('/','store');
    Route::get('/{id}','show');
    Route::put('/{id}','update');
    Route::delete('/{id}','destroy');
});
