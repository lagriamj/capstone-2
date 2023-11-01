<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReceiveService;
use App\Models\Requests;
use App\Models\CancelReason;
use App\Models\ReleaseRequests;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Carbon\Carbon;


class ReceiveServiceController extends Controller
{
    public function pendingRequest(Request $request, $startDate = null, $endDate = null, $selectedSort = null, $search = null)
    {
        $order = $request->input('order');
        $query = Requests::where('status', 'Pending')
            ->where('approved', 'yes-signature');


        if ($startDate && $endDate) {

            $query->where('dateRequested', '>=', $startDate)
                ->where('dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));
        }


        if ($order && in_array($order, ['asc', 'desc'])) {
            $query->orderByRaw("dateRequested $order");
        }

        if ($search) {
            $search = preg_replace('/^E-/i', '', $search); // Remove 'E-' or 'e-' prefix
            $query->where(function ($query) use ($search) {
                $query->where('id', 'LIKE', "%$search%")
                    ->orWhere('natureOfRequest', 'LIKE', "%$search%")
                    ->orWhere('reqOffice', 'LIKE', "%$search%")
                    ->orWhere('assignedTo', 'LIKE', "%$search%");
            });
        }

        $data = $query->get();

        return response()->json([
            'results' => $data
        ], 200);
    }


    public function receivedRequest(Request $request, $id, $fullName)
    {
        try {
            DB::table('receive_service')
                ->where('request_id', $id)
                ->update([
                    'receivedBy' => $request->input('receivedBy'),
                    'assignedTo' => $request->input('assignedTo'),
                    'dateReceived' => now(),
                ]);

            DB::table('user_requests')
                ->where('id', $request->input('request_id'))
                ->update([
                    'assignedTo' => $request->input('assignedTo'),
                    'dateUpdated' => now(),
                    'status' => 'Received',
                ]);

            // Retrieve the 'office' based on the provided $fullName from the User table
            $adminOffice = User::whereRaw("CONCAT(userFirstname, ' ', userLastName) = ?", [$fullName])
                ->select('office')
                ->first();


            $userRequest = DB::table('user_requests')
                ->where('id', $id)
                ->first();

            if ($adminOffice) {
                // Create an audit log entry for the "Received" action
                $auditLogData = [
                    'name' => $fullName, // Use the provided fullName
                    'office' => $adminOffice->office, // Use the retrieved office
                    'action' => 'Received',
                    'reference' => $userRequest->request_code,
                    'date' => now(),
                ];

                AuditLog::create($auditLogData);
            }

            // Return a JSON response with a 201 status code indicating success
            return response()->json(['message' => 'Request updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update request'], 500);
        }
    }


    public function destroyService($id)
    {
        $user = Requests::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Request not found.'
            ], 404);
        }

        if ($user) {
            $user->update(['status' => 'Cancelled']);
        }

        return response()->json([
            'message' => 'Request deleted successfully.'
        ], 200);
    }

    // public function showServiceTask($fullName)
    // {
    //     $technicianExists = DB::table('technicians')
    //         ->where('technician', $fullName)
    //         ->exists();

    //     $query = DB::table('user_requests')
    //         ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
    //         ->select('user_requests.*', 'receive_service.*')
    //         ->whereNotIn('user_requests.status', ['Pending', 'Closed', 'Cancelled']);

    //     if ($technicianExists) {
    //         $query->where('user_requests.assignedTo', '=', $fullName);
    //     }

    //     $query->orderBy('user_requests.dateUpdated', 'desc');

    //     $data = $query->get();
    //     return response()->json(['results' => $data]);
    // }

    public function showServiceTask(Request $request, $startDate = null, $endDate = null)
    {
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days'));
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d');
        }

        $query = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->select('user_requests.*', 'receive_service.*')
            ->whereNotIn('user_requests.status', ['Purge'])
            ->where('user_requests.approved', '=', 'yes-signature')
            ->whereBetween('user_requests.dateRequested', [$startDate, date('Y-m-d', strtotime($endDate . ' + 1 day'))]);

        $data = $query->get();

        foreach ($data as $record) {
            $dateServiced = Carbon::parse($record->dateServiced);
            $artaDueDate = $dateServiced->addDays($record->arta);
            if (Carbon::now()->gte($artaDueDate) && $record->status === "On Progress") {
                DB::table('receive_service')
                    ->where('id', $record->id)
                    ->update(['artaStatus' => 'Delay']);
            }
        }

        return response()->json([
            'results' => $data
        ]);
    }

    public function updateReasonDelay(Request $request, $id, $fullName)
    {
        $reasonDelay = $request->input('reasonDelay');

        if ($reasonDelay !== null) {
            DB::table('receive_service')
                ->where('request_id', $id)
                ->update([
                    'reasonDelay' => $reasonDelay,
                    'dateReason' => now(),
                ]);

            $adminOffice = User::whereRaw("CONCAT(userFirstname, ' ', userLastName) = ?", [$fullName])
                ->select('office')
                ->first();

            $userRequest = DB::table('user_requests')
                ->where('id', $id)
                ->first();

            if ($adminOffice) {
                $auditLogData = [
                    'name' => $fullName,
                    'office' => $adminOffice->office,
                    'action' => 'Reason Delay',
                    'reference' => $userRequest->request_code,
                    'date' => now(),
                ];
                AuditLog::create($auditLogData);
            }
            return response()->json(['message' => 'ReceiveService updated successfully']);
        } else {
            return response()->json(['message' => 'reasonDelay cannot be null'], 400);
        }
    }

    public function onprogressRequest(Request $request, $id, $fullName)
    {
        try {
            DB::table('receive_service')
                ->where('request_id', $id)
                ->update([
                    'serviceBy' => $request->input('serviceBy'),
                    'arta' => $request->input('arta'),
                    'artaStatus' => 'Not Delay',
                    'dateServiced' => now(),
                ]);

            DB::table('user_requests')
                ->where('id', $request->input('request_id'))
                ->update([
                    'assignedTo' => $request->input('assignedTo'),
                    'dateUpdated' => now(),
                    'status' => 'On Progress',
                ]);

            // Retrieve the 'office' based on the provided $fullName from the User table
            $adminOffice = User::whereRaw("CONCAT(userFirstname, ' ', userLastName) = ?", [$fullName])
                ->select('office')
                ->first();

            $userRequest = DB::table('user_requests')
                ->where('id', $id)
                ->first();

            if ($adminOffice) {
                // Create an audit log entry for the "On Progress" action
                $auditLogData = [
                    'name' => $fullName, // Use the provided fullName
                    'office' => $adminOffice->office, // Use the retrieved office
                    'action' => 'On Progress',
                    'reference' => $userRequest->request_code,
                    'date' => now(),
                ];

                AuditLog::create($auditLogData);
            }

            return response()->json(['message' => 'ReceiveService updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update ReceiveService'], 500);
        }
    }

    public function toreleaseRequest(Request $request, $id, $fullName)
    {
        try {
            DB::table('receive_service')
                ->where('request_id', $id)
                ->update([
                    'toRecommend' => $request->input('toRecommend'),
                    'findings' => $request->input('findings'),
                    'rootCause' => $request->input('rootCause'),
                    'actionTaken' => $request->input('actionTaken'),
                    'remarks' => $request->input('remarks'),
                ]);

            DB::table('user_requests')
                ->where('id', $request->input('request_id'))
                ->update([
                    'assignedTo' => $request->input('assignedTo'),
                    'dateUpdated' => now(),
                    'status' => 'To Release',
                ]);

            // Retrieve the 'office' based on the provided $fullName from the User table
            $adminOffice = User::whereRaw("CONCAT(userFirstname, ' ', userLastName) = ?", [$fullName])
                ->select('office')
                ->first();

            $userRequest = DB::table('user_requests')
                ->where('id', $id)
                ->first();

            if ($adminOffice) {
                // Create an audit log entry for the "To Release" action
                $auditLogData = [
                    'name' => $fullName, // Use the provided fullName
                    'office' => $adminOffice->office, // Use the retrieved office
                    'action' => 'To Release',
                    'reference' => $userRequest->request_code,
                    'date' => now(),
                ];

                AuditLog::create($auditLogData);
            }

            return response()->json(['message' => 'ReceiveService updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update ReceiveService'], 500);
        }
    }

    public function torateRequest(Request $request, $id, $fullName)
    {
        try {
            $validatedData = $request->validate([
                'receivedReq_id' => 'required',
                'request_id' => 'required',
                'approvedBy' => 'required',
                'noteBy' => 'required',
                'releasedBy' => 'required',
                'received_By' => 'required',
            ]);

            $validatedData['dateApproved'] = now();
            $validatedData['dateNoted'] = now();
            $validatedData['dateReleased'] = now();
            $validatedData['date_Received'] = now();

            $data = ReleaseRequests::create($validatedData);

            DB::table('user_requests')
                ->where('id', $id)
                ->update([
                    'dateUpdated' => now(),
                    'status' => 'To Rate',
                ]);

            // Retrieve the 'office' based on the provided $fullName from the User table
            $adminOffice = User::whereRaw("CONCAT(userFirstname, ' ', userLastName) = ?", [$fullName])
                ->select('office')
                ->first();

            $userRequest = DB::table('user_requests')
                ->where('id', $id)
                ->first();

            if ($adminOffice) {
                // Create an audit log entry for the "To Rate" action
                $auditLogData = [
                    'name' => $fullName, // Use the provided fullName
                    'office' => $adminOffice->office, // Use the retrieved office
                    'action' => 'To Rate',
                    'reference' => $userRequest->request_code,
                    'date' => now(),
                ];

                AuditLog::create($auditLogData);
            }

            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create ReleaseRequests'], 500);
        }
    }

    public function destroyServiceTask($id, $request_id)
    {
        $receivedID = ReceiveService::find($id);
        $requestID = Requests::find($request_id);

        if (!$receivedID) {
            return response()->json([
                'message' => 'Request not found.'
            ], 404);
        }

        if ($requestID) {
            $requestID->update(['status' => 'Cancelled']);
        }

        return response()->json([
            'message' => 'Request deleted successfully.'
        ], 200);
    }


    public function cancelReason(Request $request, $requestId, $fullName)
    {
        try {
            $reason = $request->input('reason');

            $requestRecord = Requests::find($requestId);

            if (!$requestRecord) {
                return response()->json(['message' => 'Request not found'], 404);
            }

            $requestRecord->update(['status' => 'Cancelled']);

            // Retrieve the 'office' based on the provided $fullName from the User table
            $adminOffice = User::whereRaw("CONCAT(userFirstname, ' ', userLastName) = ?", [$fullName])
                ->select('office')
                ->first();

            if ($adminOffice) {
                // Create an audit log entry for the "Cancelled" action
                $auditLogData = [
                    'name' => $fullName, // Use the provided fullName
                    'office' => $adminOffice->office, // Use the retrieved office
                    'action' => 'Cancelled',
                    'reference' => $requestId, // Use $requestId as reference
                    'date' => now(),
                ];

                AuditLog::create($auditLogData);
            }

            $cancelReason = new CancelReason([
                'request_id' => $requestId,
                'reason' => $reason,
            ]);
            $cancelReason->save();

            return response()->json(['message' => 'Cancellation reason saved successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save cancellation reason'], 500);
        }
    }

    public function viewCancelRequest($id)
    {
        $data = DB::table('user_requests')
            ->join('cancel_reason', 'user_requests.id', '=', 'cancel_reason.request_id')
            ->where('user_requests.id', $id)
            ->select('user_requests.*', 'cancel_reason.*')
            ->get();
        return response()->json(['results' => $data]);
    }
}
