<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReceiveService;
use App\Models\Requests;
use Illuminate\Support\Facades\DB;


class ReceiveServiceController extends Controller
{
    public function index()
    {
        $data = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->select('user_requests.*', 'receive_service.*')
            ->where('user_requests.status', '!=', 'Pending')
            ->get();

        return response()->json(['results' => $data]);
    }

    public function store(Request $request)
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

    public function updateReceiveService(Request $request, $id)
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
                'status' => 'On Process',
            ]);

        return response()->json(['message' => 'ReceiveService updated successfully', 'data' => $receiveService]);
    }

    public function allRequest()
    {
        $pendingRequests = Requests::where('status', 'Pending')->get();

        return response()->json([
            'results' => $pendingRequests
        ], 200);
    }

    public function show($id)
    {

        $record = ReceiveService::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json(['data' => $record], 200);
    }
}
