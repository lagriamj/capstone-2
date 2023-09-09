<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReceiveService;
use App\Models\Requests;
use App\Models\ReleaseRequests;
use Illuminate\Support\Facades\DB;


class ReceiveServiceController extends Controller
{
    public function pendingRequest()
    {
        $pendingRequests = Requests::where('status', 'Pending')->get();

        return response()->json([
            'results' => $pendingRequests
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
                'message' => 'User not found.'
            ], 404);
        }

        if ($user) {
            $user->update(['status' => 'Cancelled']);
        }

        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);
    }

    public function showServiceTask()
    {
        $data = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->select('user_requests.*', 'receive_service.*')
            ->whereNotIn('user_requests.status', ['Pending', 'Closed', 'Cancelled'])
            ->get();

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
                'message' => 'User not found.'
            ], 404);
        }

        // Update the status of the request to "Cancelled"
        if ($requestID) {
            $requestID->update(['status' => 'Cancelled']);
        }

        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);
    }
}