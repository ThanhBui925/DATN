<?php

use App\Http\Controllers\Api\CategoryController;


Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
Route::delete('categories/{id}/force-delete', [CategoryController::class, 'forceDelete']);
Route::post('categories/{id}/restore', [CategoryController::class, 'restore']);
Route::get('/categories/trashed', [CategoryController::class, 'trashed']);
Route::get('categories/search', [CategoryController::class, 'search']);
Route::get('categories/paginate', [CategoryController::class, 'paginate']);
Route::apiResource('categories', CategoryController::class);