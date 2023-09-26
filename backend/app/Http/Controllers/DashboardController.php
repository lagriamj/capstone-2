<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function countUserRequests()
    {
        $countPending = DB::table('user_requests')->where('status', 'Pending')->count();
        $countReceived = DB::table('user_requests')->where('status', 'Received')->count();
        $countClosed = DB::table('user_requests')->where('status', 'Closed')->count();

        return response()->json([
            'countPending' => $countPending,
            'countReceived' => $countReceived,
            'countClosed' => $countClosed,
        ], 200);
    }

    public function calculateRatings()
    {

        $topNatures = DB::table('user_requests')
            ->select('natureOfRequest', DB::raw('COUNT(*) as count'))
            ->groupBy('natureOfRequest')
            ->orderByDesc('count')
            ->limit(3)
            ->get();


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

        $resultSatisfied = DB::table('rate_services')
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

        $unSatisfiedRating = $resultSatisfied ? (int)$resultSatisfied->Satisfied_Rating : 0;

        $totalRequestSatisfied = DB::table('rate_services')->count();
        $requestSatisfied = $totalRequestSatisfied * 40;
        $SatisfiedRating = ($unSatisfiedRating / $requestSatisfied) * 100;


        $resultUnsatisfied = DB::table('rate_services')
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

        $satisfiedRating = $resultUnsatisfied ? (int)$resultUnsatisfied->Satisfied_Rating : 0;
        $totalRequestUnsatisfied = DB::table('rate_services')->count();
        $requestUnsatisfied = $totalRequestUnsatisfied * 40;
        $UnsatisfiedRating = ($satisfiedRating / $requestUnsatisfied) * 100;


        return response()->json([
            'topNature' => $topNatures,
            'totalRatings' => $totalRating,
            'satisfiedRating' => $SatisfiedRating,
            'unsatisfiedRating' => $UnsatisfiedRating,

        ]);
    }


    public function getTechnicianPerformance($startDate = null, $endDate = null)
    {
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-11 days')); // Default to 2 days ago
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }

        $performanceData = DB::table('user_requests')
            ->select(
                'assignedTo',
                DB::raw('COUNT(*) as techreq'),
                DB::raw('SUM(CASE WHEN status = "Closed" THEN 1 ELSE 0 END) as closed'),
                DB::raw('SUM(CASE WHEN status != "Closed" THEN 1 ELSE 0 END) as unclosed')
            )
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->groupBy('assignedTo')
            ->where('assignedTo', '<>', 'None')
            ->get();

        return response()->json(['Technician' => $performanceData,]);
    }


    public function getPercentAccomplished($startDate = null, $endDate = null)
    {
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-11 days')); // Default to 2 days ago
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }

        $pendingRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Pending')
            ->count();

        $receivedRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'received')
            ->count();

        $onprogressRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'On Progress')
            ->count();

        $toreleaseRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'To Release')
            ->count();

        $closedRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Closed')
            ->count();


        return response()->json([
            'pendingRequests' => $pendingRequests,
            'receivedRequests' => $receivedRequests,
            'onprogressRequests' => $onprogressRequests,
            'toreleaseRequests' => $toreleaseRequests,
            'closedRequests' => $closedRequests,
        ]);
    }

    public function getRequestsByDate($startDate = null, $endDate = null)
    {
        $unclosedRequestsData = DB::table('user_requests')
            ->selectRaw('DATE(dateRequested) as date, COUNT(*) as total')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', '!=', 'Closed')
            ->where('status', '!=', 'Cancelled')
            ->groupBy('date')
            ->get();

        $closedRequestsData = DB::table('user_requests')
            ->selectRaw('DATE(dateRequested) as date, COUNT(*) as closed')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Closed')
            ->groupBy('date')
            ->get();

        // Create a dictionary to store counts by date
        $chartData = [];

        // Process unclosed requests data
        foreach ($unclosedRequestsData as $unclosedItem) {
            $date = $unclosedItem->date;
            $total = $unclosedItem->total;

            // Initialize if date not already in the chartData
            if (!isset($chartData[$date])) {
                $chartData[$date] = [
                    'date' => $date,
                    'unclosedBydate' => 0,
                    'closedBydate' => 0,
                ];
            }

            $chartData[$date]['unclosedBydate'] = $total;
        }

        // Process closed requests data
        foreach ($closedRequestsData as $closedItem) {
            $date = $closedItem->date;
            $closed = $closedItem->closed;

            // Initialize if date not already in the chartData
            if (!isset($chartData[$date])) {
                $chartData[$date] = [
                    'date' => $date,
                    'unclosedBydate' => 0,
                    'closedBydate' => 0,
                ];
            }

            $chartData[$date]['closedBydate'] = $closed;
        }

        // Sort the chartData by date in ascending order
        usort($chartData, function ($a, $b) {
            return strtotime($a['date']) - strtotime($b['date']);
        });

        return response()->json($chartData);
    }

    public function getTotalAndClosed($startDate = null, $endDate = null)
    {
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-3 days')); // Default to 2 days ago
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }

        $totalRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->count();

        $closedRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateUpdated)'), [$startDate, $endDate])
            ->where('status', 'Closed')
            ->count();

        return response()->json([
            'totalRequests' => $totalRequests,
            'closedRequests' => $closedRequests,
        ]);
    }

    public function getStatusDescription($status, $startDate = null, $endDate = null)
    {

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-10 days'));
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }


        $requestData = DB::table('user_requests')
            ->where('status', $status)
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->get();

        return response()->json(['requestData' => $requestData]);
    }
}
