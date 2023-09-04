<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RateServices;
use App\Models\Requests;
use Illuminate\Support\Facades\DB;


class RatingController extends Controller
{

    public function indexClosed()
    {
        $closedRequests = Requests::where('status', 'Closed')->get();
        return response()->json(['results' => $closedRequests]);
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
