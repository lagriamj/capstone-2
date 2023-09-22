<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReceiveService;
use App\Models\Requests;
use App\Models\CancelReason;
use App\Models\ReleaseRequests;
use Illuminate\Support\Facades\DB;


class ReceiveServiceController extends Controller
{
    public function pendingRequest($startDate = null, $endDate = null)
    {
        $query = Requests::where('status', 'Pending');


        if ($startDate && $endDate) {

            $query->where('dateRequested', '>=', $startDate)
                ->where('dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));
        }


        $query->orderBy('dateUpdated', 'desc');

        $data = $query->get();

        return response()->json([
            'results' => $data
        ], 200);
    }


    public function receivedRequest(Request $request)
    {
        $validatedData = $request->validate([
            'request_id' => 'required',
            'receivedBy' => 'required',
            'assignedTo' => 'required',
            'serviceBy' => 'required',
            'toRecommend' => 'required',
            'findings' => 'required',
            'rootCause' => 'required',
            'actionTaken' => 'required',
            'remarks' => 'required',
        ]);

        $validatedData['dateReceived'] = now();
        $validatedData['dateServiced'] = now();

        // Create a new ReceiveService record
        $data = ReceiveService::create($validatedData);

        DB::table('user_requests')
            ->where('id', $request->input('request_id'))
            ->update([
                'assignedTo' => $request->input('assignedTo'),
                'dateUpdated' => now(),
                'status' => 'Received',
            ]);

        return response()->json($data, 201);
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

    public function showServiceTask($startDate = null, $endDate = null)
    {
        $query = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->select('user_requests.*', 'receive_service.*')
            ->whereNotIn('user_requests.status', ['Pending', 'Closed', 'Cancelled']);

        // Check if startDate and endDate parameters are provided and valid
        if ($startDate && $endDate) {
            // Use '<' for the end date to exclude it from the range
            $query->where('user_requests.dateRequested', '>=', $startDate)
                ->where('user_requests.dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));
        }

        $data = $query->get();

        return response()->json(['results' => $data]);
    }


    public function onprogressRequest(Request $request, $id)
    {
        $validatedData = $request->validate([
            'request_id' => 'required',
            'receivedBy' => 'required',
            'dateReceived' => 'required',
            'assignedTo' => 'required',
            'serviceBy' => 'required',
            'toRecommend' => 'required',
            'findings' => 'required',
            'rootCause' => 'required',
            'actionTaken' => 'required',
            'remarks' => 'required',
        ]);

        $validatedData['dateServiced'] = now();

        $receiveService = ReceiveService::findOrFail($id);
        $receiveService->update($validatedData);

        DB::table('user_requests')
            ->where('id', $request->input('request_id'))
            ->update([
                'assignedTo' => $request->input('assignedTo'),
                'dateUpdated' => now(),
                'status' => 'On Progress',
            ]);

        return response()->json(['message' => 'ReceiveService updated successfully', 'data' => $receiveService]);
    }

    public function toreleaseRequest(Request $request, $id)
    {
        $validatedData = $request->validate([
            'request_id' => 'required',
            'receivedBy' => 'required',
            'dateReceived' => 'required',
            'assignedTo' => 'required',
            'serviceBy' => 'required',
            'dateServiced' => 'required',
            'toRecommend' => 'required',
            'findings' => 'required',
            'rootCause' => 'required',
            'actionTaken' => 'required',
            'remarks' => 'required',
        ]);

        $receiveService = ReceiveService::findOrFail($id);
        $receiveService->update($validatedData);

        DB::table('user_requests')
            ->where('id', $request->input('request_id'))
            ->update([
                'assignedTo' => $request->input('assignedTo'),
                'dateUpdated' => now(),
                'status' => 'To Release',
            ]);

        return response()->json(['message' => 'ReceiveService updated successfully', 'data' => $receiveService]);
    }

    public function torateRequest(Request $request)
    {
        $validatedData = $request->validate([
            'receivedReq_id' => 'required',
            'approvedBy' => 'required',
            'noteBy' => 'required',
            'releasedBy' => 'required',
            'received_By' => 'required',

        ]);

        $receivedReqId = $request->input('request_id');

        $validatedData['dateApproved'] = now();
        $validatedData['dateNoted'] = now();
        $validatedData['dateReleased'] = now();
        $validatedData['date_Received'] = now();

        DB::table('user_requests')
            ->where('id', $request->input('request_id'))
            ->update([
                'dateUpdated' => now(),
                'status' => 'To Rate',
            ]);

        $data = ReleaseRequests::create($validatedData);
        return response()->json($data, 201);
    }

    public function destroyReceiveTask($id, $request_id)
    {
        $receivedID = ReceiveService::find($id);
        $requestID = Requests::find($request_id);

        if (!$receivedID) {
            return response()->json([
                'message' => 'Request not found.'
            ], 404);
        }

        // Update the status of the request to "Cancelled"
        if ($requestID) {
            $requestID->update(['status' => 'Cancelled']);
        }

        return response()->json([
            'message' => 'Request deleted successfully.'
        ], 200);
    }


    public function cancelReason(Request $request, $requestId)
    {
        try {
            $reason = $request->input('reason');

            $cancelReason = new CancelReason([
                'request_id' => $requestId,
                'reason' => $reason,
            ]);
            $request_id = Requests::find($requestId);
            $request_id->update(['status' => 'Cancelled']);
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
