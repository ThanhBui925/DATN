<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;

// Route api for categories
Route::delete('categories/{id}/force-delete', [CategoryController::class, 'forceDelete']);
Route::post('categories/{id}/restore', [CategoryController::class, 'restore']);
Route::get('categories/trashed', [CategoryController::class, 'trashed']);
Route::apiResource('categories', CategoryController::class);

// Route api for products
Route::delete('products/{id}/force-delete', [ProductController::class, 'forceDelete']);
Route::post('products/{id}/restore', [ProductController::class, 'restore']);
Route::get('products/trashed', [ProductController::class, 'trashed']);
Route::apiResource('products', ProductController::class);
