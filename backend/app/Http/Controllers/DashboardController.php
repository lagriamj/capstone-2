<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function countPendingUserRequests()
    {
        $count = DB::table('user_requests')->where('status', 'Pending')->count();
        return response()->json(['count' => $count], 200);
    }

    public function countAllUsers()
    {
        $count = DB::table('users')->count();
        return response()->json(['count' => $count], 200);
    }

    public function countReceivedUserRequests()
    {
        $count = DB::table('user_requests')->where('status', 'Received')->count();
        return response()->json(['count' => $count], 200);
    }

    public function countClosedUserRequests()
    {
        $count = DB::table('user_requests')->where('status', 'Closed')->count();
        return response()->json(['count' => $count], 200);
    }

    public function showCommonNatureOfRequest()
    {
        $topNatures = DB::table('user_requests')
            ->select('natureOfRequest', DB::raw('COUNT(*) as count'))
            ->groupBy('natureOfRequest')
            ->orderByDesc('count')
            ->limit(3)
            ->get();

        return response()->json(['topNatures' => $topNatures]);
    }

    public function calculateTotalRatings()
    {
        // Use the DB facade to retrieve the ratings from the database
        $totalAllRatings = DB::table('rate_services')
            ->sum('q1') + DB::table('rate_services')
            ->sum('q2') + DB::table('rate_services')
            ->sum('q3') + DB::table('rate_services')
            ->sum('q4') + DB::table('rate_services')
            ->sum('q5') + DB::table('rate_services')
            ->sum('q6') + DB::table('rate_services')
            ->sum('q7') + DB::table('rate_services')
            ->sum('q8');

        $totalRequest = DB::table('rate_services')->count();
        $request = $totalRequest * 40;
        $totalRating = ($totalAllRatings / $request) * 100;


        return response()->json([
            'total_ratings' => $totalRating,
        ]);
    }

    public function calculateSatisfiedRatings()
    {
        $result = DB::table('rate_services')
            ->selectRaw('SUM(
                CASE WHEN q1 = 5 THEN q1 ELSE 0 END +
                CASE WHEN q2 = 5 THEN q2 ELSE 0 END +
                CASE WHEN q3 = 5 THEN q3 ELSE 0 END +
                CASE WHEN q4 = 5 THEN q4 ELSE 0 END +
                CASE WHEN q5 = 5 THEN q5 ELSE 0 END +
                CASE WHEN q6 = 5 THEN q6 ELSE 0 END +
                CASE WHEN q7 = 5 THEN q7 ELSE 0 END +
                CASE WHEN q8 = 5 THEN q8 ELSE 0 END
            ) AS Satisfied_Rating')
            ->first();

        $unSatisfiedRating = $result ? (int)$result->Satisfied_Rating : 0;

        $totalRequest = DB::table('rate_services')->count();
        $request = $totalRequest * 40;
        $totalRating = ($unSatisfiedRating / $request) * 100;

        return response()->json(['SatisfiedRating' => $totalRating]);
    }

    public function calculateUnSatisfiedRatings()
    {
        $result = DB::table('rate_services')
            ->selectRaw('SUM(
                CASE WHEN q1 = 1 THEN q1 ELSE 0 END +
                CASE WHEN q2 = 1 THEN q2 ELSE 0 END +
                CASE WHEN q3 = 1 THEN q3 ELSE 0 END +
                CASE WHEN q4 = 1 THEN q4 ELSE 0 END +
                CASE WHEN q5 = 1 THEN q5 ELSE 0 END +
                CASE WHEN q6 = 1 THEN q6 ELSE 0 END +
                CASE WHEN q7 = 1 THEN q7 ELSE 0 END +
                CASE WHEN q8 = 1 THEN q8 ELSE 0 END
            ) AS Satisfied_Rating')
            ->first();

        $satisfiedRating = $result ? (int)$result->Satisfied_Rating : 0;

        $totalRequest = DB::table('rate_services')->count();
        $request = $totalRequest * 40;
        $totalRating = ($satisfiedRating / $request) * 100;

        return response()->json(['UnSatisfiedRating' => $totalRating]);
    }
}