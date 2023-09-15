<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\ReceiveServiceController;
use App\Http\Controllers\NatureRequestController;
use App\Http\Controllers\UtilitySettingController;
use App\Http\Controllers\TechnicianController;
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

//Login and Register
Route::post('/register', [UserController::class, 'register']);
Route::post('/verify-otp', [UserController::class, 'verifyOTP']);
Route::put('/verify-otp', [UserController::class, 'resendOTP']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LogoutController::class, 'logout']);
Route::put('/update-phone', [UserController::class, 'updatePhoneNumber']);

//Admin and User
Route::post('/change-password', [UserController::class, 'changePassword']);
Route::post('/check-password', [UserController::class, 'checkPassword']);
Route::put('/update-contact', [UserController::class, 'updateContactNumber']);

//Request Services (user side)
Route::get('/getOfficeAndDivision/{userID}', [RequestsController::class, 'getOfficeAndDivision']);
Route::post('add-request', [RequestsController::class, 'addRequest']);

//Current Requests (user side)
Route::get('request-list', [RequestsController::class, 'showRequest']);
Route::put('closedNorate/{id}', [RatingController::class, 'closedNorate']);
Route::delete('delete-request/{id}', [RequestsController::class, 'destroyRequest']);

//Transaction (user side)
Route::get('transaction-list/{id}', [RatingController::class, 'showTransanction']);
Route::get('closed-view/{id}', [RatingController::class, 'closedView']);
Route::post('transanction-rate', [RatingController::class, 'rateTransaction']);

//Account (user side)
Route::get('/account', [UserController::class, 'accountDetails']);

//Receive Service (admin side)
Route::put('delete-receive/{id}', [ReceiveServiceController::class, 'destroyService']);
Route::get('pending-request', [ReceiveServiceController::class, 'pendingRequest']);
Route::post('received-request', [ReceiveServiceController::class, 'receivedRequest']);

//Service Task (admin side)
Route::get('service-task-list', [ReceiveServiceController::class, 'showServiceTask']);
Route::put('onprogress-request/{id}', [ReceiveServiceController::class, 'onprogressRequest']);
Route::put('torelease-request/{id}', [ReceiveServiceController::class, 'toreleaseRequest']);
Route::post('torate-request', [ReceiveServiceController::class, 'torateRequest']);
Route::put('delete-serviced/{id}/{reqID}', [ReceiveServiceController::class, 'destroyReceiveTask']);

//Service Transaction
Route::get('closed-transaction', [RatingController::class, 'showServiceTransanction']);

//Account List in Account (admin side)
Route::get('/users-list', [UserController::class, 'showUsersList']);
Route::post('/admin/register', [UserController::class, 'register']);
Route::put('/admin/updateUser', [UserController::class, 'update']);
Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);

//Office or Department in Utility Setting (admin side)
Route::get('office-list', [UtilitySettingController::class, 'showOffice']);
Route::post('add-office', [UtilitySettingController::class, 'addOffice']);
Route::put('update-office', [UtilitySettingController::class, 'updateOffice']);
Route::delete('delete-office/{id}', [UtilitySettingController::class, 'destroyOffice']);

//Categories in Utility Setting (admin side)
Route::get('category-list', [UtilitySettingController::class, 'showCategory']);
Route::post('add-category', [UtilitySettingController::class, 'addCategory']);
Route::put('update-category', [UtilitySettingController::class, 'updateCategory']);
Route::delete('delete-category/{id}', [UtilitySettingController::class, 'destroyCategoy']);

//Nature Request in Utility Setting (admin side)
Route::get('nature-list', [NatureRequestController::class, 'showNature']);
Route::post('add-nature', [NatureRequestController::class, 'addNature']);
Route::put('update-nature', [NatureRequestController::class, 'updateNature']);
Route::delete('delete-nature/{id}', [NatureRequestController::class, 'destroyNature']);

//Technician in Utility Setting (admin side)
Route::get('technician-list', [TechnicianController::class, 'showTechnician']);
Route::post('add-technician', [TechnicianController::class, 'addTechnician']);
Route::put('update-technician', [TechnicianController::class, 'updateTechnician']);
Route::delete('delete-technician/{id}', [TechnicianController::class, 'destroyTechnician']);

Route::post('cancel-reason/{id}', [ReceiveServiceController::class, 'cancelReason']);
Route::get('view-cancelled/{id}', [ReceiveServiceController::class, 'viewCancelRequest']);
