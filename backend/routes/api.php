<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestsController;
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

Route::put('/update-phone', [UserController::class, 'updatePhoneNumber']);

Route::get('current-request', [RequestsController::class, 'index']);
Route::get('users/{id}', [RequestsController::class, 'show']);
Route::post('service-request', [RequestsController::class, 'store']);
Route::put('requestupdate/{id}', [RequestsController::class, 'update']);
Route::delete('requestdelete/{id}', [RequestsController::class, 'destroy']);
