<?php
<<<<<<< Updated upstream

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;

// Route api for categories
Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
Route::delete('categories/{id}/force-delete', [CategoryController::class, 'forceDelete']);
Route::post('categories/{id}/restore', [CategoryController::class, 'restore']);
Route::get('categories/trashed', [CategoryController::class, 'trashed']);
Route::apiResource('categories', CategoryController::class);

// Route api for products
Route::delete('products/{id}/force-delete', [ProductController::class, 'forceDelete']);
Route::post('products/{id}/restore', [ProductController::class, 'restore']);
Route::get('products/trashed', [ProductController::class, 'trashed']);
Route::apiResource('products', ProductController::class);
=======

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->get('/banners', [BannerController::class, 'index']);
Route::middleware('auth:sanctum')->post('/banners', [BannerController::class, 'store']);
Route::middleware('auth:sanctum')->put('/banners/{id}', [BannerController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/banners/{id}', [BannerController::class, 'destroy']);

>>>>>>> Stashed changes
