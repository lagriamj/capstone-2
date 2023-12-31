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
use App\Http\Controllers\AuthorizedSignController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserSignatureController;
use App\Http\Controllers\HeadApprovedController;
use App\Http\Controllers\AuditLogController;

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


Route::post('/login', [LoginController::class, 'login'])->middleware('throttle:login-api');



Route::middleware('api')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/verify-otp', [UserController::class, 'verifyOTP']);
    Route::put('/verify-otp', [UserController::class, 'resendOTP']);
    Route::post('/logout', [LogoutController::class, 'logout']);
    Route::put('/update-phone', [UserController::class, 'updatePhoneNumber']);
    Route::post('/forgot-password', [UserController::class, 'checkEmail']);
    Route::post('/check-otp', [UserController::class, 'checkOTP']);
    Route::put('/new-password', [UserController::class, 'newPassword']);
    //Request Services (user side)
    Route::get('/getOfficeAndDivision/{userID}', [RequestsController::class, 'getOfficeAndDivision']);
    Route::post('add-request', [RequestsController::class, 'addRequest']);

    //Current Requests (user side)
    Route::get('request-list', [RequestsController::class, 'showRequest']);
    Route::put('closedNorate/{id}', [RatingController::class, 'closedNorate']);
    Route::delete('delete-request/{id}', [RequestsController::class, 'destroyRequest']);

    //Transaction (user side)
    Route::get('transaction-list', [RatingController::class, 'showTransanction']);
    Route::get('closed-view/{id}', [RatingController::class, 'closedView']);
    Route::post('transanction-rate', [RatingController::class, 'rateTransaction']);
    Route::get('done-rate', [RatingController::class, 'doneRating']);
    Route::get('view-rate/{id}', [RatingController::class, 'viewRating']);

    //Account (user side)
    Route::get('/account', [UserController::class, 'accountDetails']);
    Route::post('/change-password', [UserController::class, 'changePassword'])->middleware('throttle:account');
    Route::post('/check-password', [UserController::class, 'checkPassword']);
    Route::put('/update-contact', [UserController::class, 'updateContactNumber']);

    //Receive Service (admin side)
    Route::put('delete-receive/{id}', [ReceiveServiceController::class, 'destroyService']);
    Route::get('pending-request/{startDate?}/{endDate?}/{selectedSort?}/{search?}', [ReceiveServiceController::class, 'pendingRequest']);
    Route::post('received-request/{id}/{fullName}', [ReceiveServiceController::class, 'receivedRequest']);

    //Service Task (admin side)
    Route::get('/service-task-list', [ReceiveServiceController::class, 'showServiceTask']);
    Route::get('received-details/{startDate?}/{endDate?}', [ReceiveServiceController::class, 'showReceived']);


    // Route::get('service-my-task-list/{fullName}', [ReceiveServiceController::class, 'showMyServiceTask']);
    Route::put('onprogress-request/{id}/{fullName}', [ReceiveServiceController::class, 'onprogressRequest']);
    Route::put('torelease-request/{id}/{fullName}', [ReceiveServiceController::class, 'toreleaseRequest']);
    Route::post('torate-request/{id}/{fullName}', [ReceiveServiceController::class, 'torateRequest']);
    Route::put('delete-serviced/{id}/{reqID}', [ReceiveServiceController::class, 'destroyServiceTask']);

    //Service Transaction
    Route::get('closed-transaction/{startDate?}/{endDate?}/{selectedStatus?}/{selectedSort?}/{search?}', [RatingController::class, 'showServiceTransanction']);

    //Account List in Account (admin side)
    Route::get('/users-list', [UserController::class, 'showUsersList']);
    Route::post('/admin/register', [UserController::class, 'registerNoOTP']);
    Route::put('/admin/updateUser', [UserController::class, 'update']);
    Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);
    Route::post('/delete-selected-users', [UserController::class, 'deleteSelectedUsers']);

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
    Route::post('cancel-reason/{id}/{name}', [ReceiveServiceController::class, 'cancelReason']);
    Route::get('view-cancelled/{id}', [ReceiveServiceController::class, 'viewCancelRequest']);
});

// Dashboard
Route::middleware('throttle:dashboard-api')->group(function () {
    Route::get('count-requests', [DashboardController::class, 'countUserRequests']);
    Route::get('calculate-rating', [DashboardController::class, 'calculateRatings']);

    Route::get('technician-performance', [DashboardController::class, 'getTechnicianPerformance']);
    Route::get('percent-accomplished', [DashboardController::class, 'getPercentAccomplished']);
    Route::get('requestsByDate', [DashboardController::class, 'getRequestsByDate']);
    Route::get('totalRequests-And-Closed', [DashboardController::class, 'getTotalAndClosed']);
    Route::get('status-description', [DashboardController::class, 'getStatusDescription']);
    Route::get('office-performance', [DashboardController::class, 'getOfficePerformance']);
    Route::get('request-description', [DashboardController::class, 'getRequestsDescription']);
    Route::get('/tech-performance', [DashboardController::class, 'technicianTable']);
    Route::get('/summary-list', [DashboardController::class, 'summaryList']);
    Route::get('/delay-request', [DashboardController::class, 'artaDelay']);
    Route::get('/delay-report', [DashboardController::class, 'delayReport']);
    Route::get('/view-remarks', [DashboardController::class, 'viewRemarks']);
    Route::get('/view-reasons', [DashboardController::class, 'viewReason']);
});

//signature
Route::post('/user-signature/store', [UserSignatureController::class, 'userSignature']);
Route::get('/all-signature/{userID}', [UserSignatureController::class, 'allSignature']);
Route::post('/update-signature/{fullName}', [UserSignatureController::class, 'updateSignature']);
Route::get('/user-signature/{fullName}', [UserSignatureController::class, 'getSignature']);
Route::get('/user-signatureInAccount/', [UserSignatureController::class, 'getSignatureInAccount']);
Route::get('/get-signatureFileName/', [UserSignatureController::class, 'getFileName']);

Route::get('/show-approved-request/{request_id}', [UserSignatureController::class, 'approvedAuthorSign']);
Route::get('/user-approved-signature/{filename}', [UserSignatureController::class, 'getApprovedSignature']);

//head
Route::get('/pending-signature/{userID}', [HeadApprovedController::class, 'allpendingNotApproved']);
Route::get('/pending-approved-signature/{userID}', [HeadApprovedController::class, 'allpendingApproved']);
Route::put('/approve-request/{requestId}', [HeadApprovedController::class, 'approveRequest']);
Route::post('approve-selected-requests', [HeadApprovedController::class, 'approveSelectedRequests']);

//audit log
Route::get('/audit-logs', [AuditLogController::class, 'showAuditLog']);

//cut-off time
Route::post('/cut-off', [RequestsController::class, 'cutOffRequest']);
Route::get('/getCutOffTime', [RequestsController::class, 'getCutOffTime']);
Route::get('/reset-cut-off-time', [RequestsController::class, 'resetCutOffTime']);

Route::get('admin-list', [UserController::class, 'showTechnicians']);

Route::get('request-threshold', [RequestsController::class, 'getRequestsThreshold']);
Route::get('threshold-history', [RequestsController::class, 'getThresholdHistory']);

Route::put('update-reason-delay/{id}/{fullName}', [ReceiveServiceController::class, 'updateReasonDelay']);


Route::post('/add-arta-reason', [RequestsController::class, 'addArtaReason']);
Route::get('/show-arta-reason/{id}', [RequestsController::class, 'showArtaReason']);

Route::get('/head-list', [UserController::class, 'showHeads']);
Route::put('/update-request/{id}', [RequestsController::class, 'updateRequest']);

Route::put('/force-change-password', [UserController::class, 'forceChangePassword']);
