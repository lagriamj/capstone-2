<?php

namespace App\Http\Controllers;

use App\Models\Requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HeadApprovedController extends Controller
{
    public function allpendingNotApproved($userID)
    {
        $officeRequest = DB::table('users')
            ->select('office')
            ->where('userID', $userID)
            ->first();

        if (!$officeRequest) {
            return response()->json(['error' => 'Office not found for the given user.'], 404);
        }

        $office = $officeRequest->office;

        $requests = DB::table('user_requests')
            ->where('status', '=', 'Pending')
            ->where('approved', '=', 'no-signature')
            ->where('reqOffice', '=', $office)
            ->get();

        return response()->json($requests);
    }

    public function allpendingApproved($userID)
    {
        $officeRequest = DB::table('users')
            ->select('office')
            ->where('userID', $userID)
            ->first();

        if (!$officeRequest) {
            return response()->json(['error' => 'Office not found for the given user.'], 404);
        }

        $office = $officeRequest->office;

        $requests = DB::table('user_requests')
            ->where('status', '=', 'Pending')
            ->where('approved', '=', 'yes-signature')
            ->where('reqOffice', '=', $office)
            ->get();

        return response()->json($requests);
    }

    public function approveRequest($requestId)
    {
        try {
            DB::table('user_requests')
                ->where('id', $requestId)
                ->update(['approved' => 'yes-signature']);

            return response()->json(['message' => 'Request approved successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to approve request'], 500);
        }
    }

    public function approveSelectedRequests(Request $request)
    {
        $selectedRequestIDs = $request->input('selectedRequestIDs', []);

        if (empty($selectedRequestIDs)) {
            return response()->json(['message' => 'No request selected for approve'], 400);
        }

        try {
            // Perform the bulk deletion
            Requests::whereIn('request_code', $selectedRequestIDs)->update(['approved' => 'yes-signature']);

            return response()->json(['message' => 'Selected users Inactive successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating users'], 500);
        }
    }
}