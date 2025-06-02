<?php

use App\Http\Controllers\Api\CategoryController;

Route::apiResource('categories', CategoryController::class);

Route::delete('categories/{slug}', [CategoryController::class, 'destroy']);
Route::delete('categories/{slug}/force-delete', [CategoryController::class, 'forceDelete']);
Route::post('categories/{slug}/restore', [CategoryController::class, 'restore']);
Route::get('categories/trashed', [CategoryController::class, 'trashed']);



Route::get('categories/search', [CategoryController::class, 'search']);
Route::get('categories/paginate', [CategoryController::class, 'paginate']);