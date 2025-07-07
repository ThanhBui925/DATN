<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/reset-password', function (Request $request) {
    return view('emails.reset-password', [
        'token' => $request->query('token'),
        'email' => $request->query('email'),
    ]);
})->name('password.reset');
