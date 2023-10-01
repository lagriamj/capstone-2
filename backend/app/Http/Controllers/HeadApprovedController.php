<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HeadApprovedController extends Controller
{
    public function allpendingNotApproved($fullName)
    {
        $officeRequest = DB::table('users')
            ->select('office')
            ->whereRaw('CONCAT(userFirstName, " ", userLastName) = ?', [$fullName])
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


    public function allpendingApproved($fullName)
    {
        $officeRequest = DB::table('users')
            ->select('office')
            ->whereRaw('CONCAT(userFirstName, " ", userLastName) = ?', [$fullName])
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
}
