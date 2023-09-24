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
use App\Http\Controllers\DashboardController;
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

//Request Services (user side)
Route::get('/getOfficeAndDivision/{userID}', [RequestsController::class, 'getOfficeAndDivision']);
Route::post('add-request', [RequestsController::class, 'addRequest']);

//Current Requests (user side)
Route::get('request-list/{startDate?}/{endDate?}/{selectedStatus?}/{selectedSort?}/{search?}', [RequestsController::class, 'showRequest']);
Route::put('closedNorate/{id}', [RatingController::class, 'closedNorate']);
Route::delete('delete-request/{id}', [RequestsController::class, 'destroyRequest']);

//Transaction (user side)
Route::get('transaction-list/{id}/{startDate?}/{endDate?}/{selectedStatus?}/{selectedSort?}/{search?}/{order?}', [RatingController::class, 'showTransanction']);
Route::get('closed-view/{id}', [RatingController::class, 'closedView']);
Route::post('transanction-rate', [RatingController::class, 'rateTransaction']);
Route::get('done-rate', [RatingController::class, 'doneRating']);
Route::get('view-rate/{id}', [RatingController::class, 'viewRating']);

//Account (user side)
Route::get('/account', [UserController::class, 'accountDetails']);
Route::post('/change-password', [UserController::class, 'changePasswoequestupdaterd']);
Route::post('/check-password', [UserController::class, 'checkPassword']);
Route::put('/update-contact', [UserController::class, 'updateContactNumber']);

//Receive Service (admin side)
Route::put('delete-receive/{id}', [ReceiveServiceController::class, 'destroyService']);
Route::get('pending-request/{startDate?}/{endDate?}/{selectedSort?}/{search?}', [ReceiveServiceController::class, 'pendingRequest']);
Route::post('received-request', [ReceiveServiceController::class, 'receivedRequest']);

//Service Task (admin side)
Route::get('service-task-list/{technician?}/{startDate?}/{endDate?}/{selectedStatus?}/{selectedSort?}/{search?}', [ReceiveServiceController::class, 'showServiceTask']);
// Route::get('service-my-task-list/{fullName}', [ReceiveServiceController::class, 'showMyServiceTask']);
Route::put('onprogress-request/{id}', [ReceiveServiceController::class, 'onprogressRequest']);
Route::put('torelease-request/{id}', [ReceiveServiceController::class, 'toreleaseRequest']);
Route::post('torate-request', [ReceiveServiceController::class, 'torateRequest']);
Route::put('delete-serviced/{id}/{reqID}', [ReceiveServiceController::class, 'destroyServiceTask']);

//Service Transaction
Route::get('closed-transaction/{startDate?}/{endDate?}/{selectedStatus?}/{selectedSort?}/{search?}', [RatingController::class, 'showServiceTransanction']);

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

// View Cancel Reason
Route::post('cancel-reason/{id}', [ReceiveServiceController::class, 'cancelReason']);
Route::get('view-cancelled/{id}', [ReceiveServiceController::class, 'viewCancelRequest']);


// Dashboard
Route::get('count-requests', [DashboardController::class, 'countUserRequests']);
Route::get('calculate-rating', [DashboardController::class, 'calculateRatings']);

Route::get('technician-performance/{startDate?}/{endDate?}', [DashboardController::class, 'getTechnicianPerformance']);
Route::get('percent-accomplished/{startDate?}/{endDate?}', [DashboardController::class, 'getPercentAccomplished']);
Route::get('requestsByDate/{startDate?}/{endDate?}', [DashboardController::class, 'getRequestsByDate']);
Route::get('totalRequests-And-Closed/{startDate?}/{endDate?}', [DashboardController::class, 'getTotalAndClosed']);
Route::get('status-description/{status}/{startDate?}/{endDate?}', [DashboardController::class, 'getStatusDescription']);
