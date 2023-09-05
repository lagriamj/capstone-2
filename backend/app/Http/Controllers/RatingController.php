<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RateServices;
use App\Models\ReceiveService;
use App\Models\Requests;
use Illuminate\Support\Facades\DB;


class RatingController extends Controller
{

    public function indexClosed()
    {
        $closedRequests = Requests::where('status', 'Closed')->get();
        return response()->json(['results' => $closedRequests]);
    }

    public function closedView($id)
    {
        $closedData = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->join('release_requests', 'receive_service.id', '=', 'release_requests.receivedReq_id')
            ->where('user_requests.id', $id) // Filter by the specific ID
            ->select('user_requests.*', 'receive_service.*', 'release_requests.*')
            ->get();

        return response()->json(['results' => $closedData]);
    }






    public function shesh(Request $request)
    {
        $validatedData = $request->validate([
            'receivedReq_id' => 'required',
        ]);

        $receivedReqId = $validatedData['receivedReq_id'];

        $data = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->select('user_requests.*', 'receive_service.*')
            ->where('receive_service.receivedReq_id', '=', $receivedReqId)
            ->get();

        return response()->json(['results' => $data]);
    }


    public function serviceRatings(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required',
            'request_id' => 'required',
            'department' => 'required',
            'q1' => 'required',
            'q2' => 'required',
            'q3' => 'required',
            'q4' => 'required',
            'q5' => 'required',
            'q6' => 'required',
            'q7' => 'required',
            'q8' => 'required',
            'commendation' => 'required',
            'suggestion' => 'required',
            'request' => 'required',
            'complaint' => 'required',
        ]);
        $validatedData['dateRate'] = now();
        $users = RateServices::create($validatedData);

        DB::table('user_requests')
            ->where('id', $request->input('request_id'))
            ->update([
                'dateUpdated' => now(),
                'status' => 'Closed',
            ]);
        return response()->json($users, 201);
    }
}
