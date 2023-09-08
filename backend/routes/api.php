<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\ReceiveServiceController;
use App\Http\Controllers\NatureRequestController;
use App\Http\Controllers\UtilitySettingController;
use App\Http\Controllers\RatingController;
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
Route::post('/logout', [LogoutController::class, 'logout']);

Route::put('/update-phone', [UserController::class, 'updatePhoneNumber']);

// user 
Route::get('current-request', [RequestsController::class, 'index']);
Route::get('/getOfficeAndDivision/{userID}', [RequestsController::class, 'getOfficeAndDivision']);
Route::get('users/{id}', [RequestsController::class, 'show']);
Route::post('service-request', [RequestsController::class, 'store']);
Route::put('requestupdate/{id}', [RequestsController::class, 'update']);
Route::delete('requestdelete/{id}', [RequestsController::class, 'destroy']);
Route::post('/check-password', [UserController::class, 'checkPassword']);
Route::put('/update-contact', [UserController::class, 'updateContactNumber']);


Route::get('nature-request', [NatureRequestController::class, 'index']);
Route::get('/account', [UserController::class, 'accountDetails']);
Route::post('/change-password', [UserController::class, 'changePassword']);

// admin 

Route::get('categories', [UtilitySettingController::class, 'index']);
Route::post('add-category', [UtilitySettingController::class, 'store']);
Route::put('category/{id}', [UtilitySettingController::class, 'update']);
Route::delete('categorydelete/{id}', [UtilitySettingController::class, 'destroy']);

Route::get('all-request', [ReceiveServiceController::class, 'allRequest']);
Route::get('service-task', [ReceiveServiceController::class, 'index']);
Route::get('closed-transactions', [ReceiveServiceController::class, 'closedTransaction']);
Route::get('for-released', [RatingController::class, 'shesh']);
Route::post('received-request', [ReceiveServiceController::class, 'store']);
Route::put('serviced/{id}', [ReceiveServiceController::class, 'updateReceiveService']);

Route::put('delete-received/{id}', [ReceiveServiceController::class, 'destroyPendingService']);
Route::put('delete-serviced/{id}/{reqID}', [ReceiveServiceController::class, 'destroyReceiveTask']);


Route::put('to-release/{id}', [ReceiveServiceController::class, 'updateReceiveToRelease']);
Route::post('to-closed', [ReceiveServiceController::class, 'toReleased']);

Route::get('closed-transaction/{id}', [RatingController::class, 'indexClosed']);
Route::post('service-rating', [RatingController::class, 'serviceRatings']);
Route::get('closed-view/{id}', [RatingController::class, 'closedView']);
Route::put('closedNorate/{id}', [RatingController::class, 'closedNorate']);

Route::get('/users-list', [UserController::class, 'showUsersList']);
Route::post('/admin/register', [UserController::class, 'register']);
Route::put('/admin/updateUser', [UserController::class, 'update']);
Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);

//Office or Department in Utility Setting (admin side)
Route::get('office-list', [UtilitySettingController::class, 'showOffice']);
Route::post('add-office', [UtilitySettingController::class, 'addOffice']);
Route::put('update-office', [UtilitySettingController::class, 'updateOffice']);
Route::delete('delete-office/{id}', [UtilitySettingController::class, 'destroyOffice']);
