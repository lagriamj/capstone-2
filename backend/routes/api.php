<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckAdminRole;
use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\RedirectGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [UserController::class, 'register']);

Route::post('/verify-otp', [UserController::class, 'verifyOTP']);

Route::put('/verify-otp', [UserController::class, 'resendOTP']);

Route::post('/login', [LoginController::class, 'login']);



Route::middleware([CheckAdminRole::class])->group(function () {
    // Admin-only routes
    Route::get('/dashboard');
});

Route::middleware([CheckUserRole::class])->group(function () {
    // Admin-only routes
    Route::get('/request');
    Route::get('/current-requests');
    Route::get('/transactions');
    Route::get('/account');
});