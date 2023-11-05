<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Technician;
use App\Models\ReceiveService;
use App\Models\RateServices;
use App\Models\Requests;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function countUserRequests()
    {
        $countPending = DB::table('user_requests')
            ->where('status', 'Pending')
            ->where('approved', 'yes-signature')
            ->count();

        $countReceived = DB::table('user_requests')
            ->where('status', 'Received')
            ->where('approved', 'yes-signature')
            ->count();

        $countClosed = DB::table('user_requests')
            ->where('status', 'Closed')
            ->where('approved', 'yes-signature')
            ->count();

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

        if ($request == 0) {
            $totalRating = 0;
        } else {
            $totalRating = ($totalAllRatings / $request) * 100;
        }

        $resultSatisfied = DB::table('rate_services')
            ->selectRaw('SUM(
                CASE WHEN q1 IN (4, 5) THEN q1 ELSE 0 END +
                CASE WHEN q2 IN (4, 5) THEN q2 ELSE 0 END +
                CASE WHEN q3 IN (4, 5) THEN q3 ELSE 0 END +
                CASE WHEN q4 IN (4, 5) THEN q4 ELSE 0 END +
                CASE WHEN q5 IN (4, 5) THEN q5 ELSE 0 END +
                CASE WHEN q6 IN (4, 5) THEN q6 ELSE 0 END +
                CASE WHEN q7 IN (4, 5) THEN q7 ELSE 0 END +
                CASE WHEN q8 IN (4, 5) THEN q8 ELSE 0 END
            ) AS Satisfied_Rating')
            ->first();

        $unSatisfiedRating = $resultSatisfied ? (int)$resultSatisfied->Satisfied_Rating : 0;

        $totalRequestSatisfied = DB::table('rate_services')->count();
        $requestSatisfied = $totalRequestSatisfied * 40;
        
        $totalRequestSatisfied = DB::table('rate_services')->count();
        $requestSatisfied = $totalRequestSatisfied * 40;

        if ($requestSatisfied == 0) {
            $SatisfiedRating = 0;
        } else {
            $SatisfiedRating = ($unSatisfiedRating / $requestSatisfied) * 100;
        }


        $resultUnsatisfied = DB::table('rate_services')
            ->selectRaw('SUM(
                CASE WHEN q1 IN (1, 2) THEN q1 ELSE 0 END +
                CASE WHEN q2 IN (1, 2) THEN q2 ELSE 0 END +
                CASE WHEN q3 IN (1, 2) THEN q3 ELSE 0 END +
                CASE WHEN q4 IN (1, 2) THEN q4 ELSE 0 END +
                CASE WHEN q5 IN (1, 2) THEN q5 ELSE 0 END +
                CASE WHEN q6 IN (1, 2) THEN q6 ELSE 0 END +
                CASE WHEN q7 IN (1, 2) THEN q7 ELSE 0 END +
                CASE WHEN q8 IN (1, 2) THEN q8 ELSE 0 END
            ) AS Satisfied_Rating')
            ->first();


        $satisfiedRating = $resultUnsatisfied ? (int)$resultUnsatisfied->Satisfied_Rating : 0;
        $totalRequestUnsatisfied = DB::table('rate_services')->count();
        $requestUnsatisfied = $totalRequestUnsatisfied * 40;
            
        if ($requestUnsatisfied == 0) {
            $UnsatisfiedRating = 0;
        } else {
            $UnsatisfiedRating = ($satisfiedRating / $requestUnsatisfied) * 100;
        }

        return response()->json([
            'topNature' => $topNatures,
            'totalRatings' => $totalRating,
            'satisfiedRating' => $SatisfiedRating,
            'unsatisfiedRating' => $UnsatisfiedRating,

        ]);
    }

    public function getTechnicianPerformance(Request $request)
    {
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days'));
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d');
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

    public function getOfficePerformance(Request $request)
    {
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
        
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days')); // Default to 10 days ago
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }

        $performanceData = DB::table('user_requests')
            ->select(
                'reqOffice',
                DB::raw('COUNT(*) as techreq'),
                DB::raw('SUM(CASE WHEN status = "Closed" THEN 1 ELSE 0 END) as closed'),
                DB::raw('SUM(CASE WHEN status != "Closed" THEN 1 ELSE 0 END) as unclosed')
            )
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->groupBy('reqOffice')
            ->where('reqOffice', '<>', 'None')
            ->get();

        return response()->json(['office' => $performanceData,]);
    }


    public function getPercentAccomplished(Request $request)
    {
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days')); 
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d');
        }

        $pendingRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Pending')
            ->where('approved', 'yes-signature')
            ->count();

        $receivedRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Received')
            ->count();

        $onprogressRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'On Progress')
            ->count();

        $toreleaseRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'To Release')
            ->count();

        $torateRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'To Rate')
            ->count();

        $closedRequests = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Closed')
            ->count();

        $officePending = DB::table('user_requests')
            ->select('reqOffice', DB::raw('COUNT(*) as request_count'))
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Pending')
            ->groupBy('reqOffice')
            ->orderByDesc('request_count')
            ->limit(1)
            ->pluck('reqOffice')
            ->first();

        $officeReceived = DB::table('user_requests')
            ->select('reqOffice', DB::raw('COUNT(*) as request_count'))
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Received')
            ->groupBy('reqOffice')
            ->orderByDesc('request_count')
            ->limit(1)
            ->pluck('reqOffice')
            ->first();

        $officeOnProgress = DB::table('user_requests')
            ->select('reqOffice', DB::raw('COUNT(*) as request_count'))
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'On Progress')
            ->groupBy('reqOffice')
            ->orderByDesc('request_count')
            ->limit(1)
            ->pluck('reqOffice')
            ->first();

        $officeToRelease = DB::table('user_requests')
            ->select('reqOffice', DB::raw('COUNT(*) as request_count'))
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'To Release')
            ->groupBy('reqOffice')
            ->orderByDesc('request_count')
            ->limit(1)
            ->pluck('reqOffice')
            ->first();

        $officeToRate = DB::table('user_requests')
            ->select('reqOffice', DB::raw('COUNT(*) as request_count'))
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'To Rate')
            ->groupBy('reqOffice')
            ->orderByDesc('request_count')
            ->limit(1)
            ->pluck('reqOffice')
            ->first();

        $officeClosed = DB::table('user_requests')
            ->select('reqOffice', DB::raw('COUNT(*) as request_count'))
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->where('status', 'Closed')
            ->groupBy('reqOffice')
            ->orderByDesc('request_count')
            ->limit(1)
            ->pluck('reqOffice')
            ->first();

        return response()->json([
            'pendingRequests' => $pendingRequests,
            'receivedRequests' => $receivedRequests,
            'onprogressRequests' => $onprogressRequests,
            'toreleaseRequests' => $toreleaseRequests,
            'torateRequests' => $torateRequests,
            'closedRequests' => $closedRequests,
            'officePending' => $officePending,
            'officeReceived' => $officeReceived,
            'officeOnProgress' => $officeOnProgress,
            'officeToRelease' => $officeToRelease,
            'officeToRate' => $officeToRate,
            'officeClosed' => $officeClosed,
        ]);
    }

    public function getRequestsByDate(Request $request)
    {
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
        
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days')); // Default to 10 days ago
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }

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

    public function getTotalAndClosed(Request $request)
    {
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days')); 
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d');
        }

        $totalRequests = DB::table('user_requests')
            ->where('approved', 'yes-signature')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate])
            ->count();

        $closedRequests = DB::table('user_requests')
            ->where('approved', 'yes-signature')
            ->whereBetween(DB::raw('DATE(dateUpdated)'), [$startDate, $endDate])
            ->where('status', 'Closed')
            ->count();

        return response()->json([
            'totalRequests' => $totalRequests,
            'closedRequests' => $closedRequests,
        ]);
    }

    public function getStatusDescription(Request $request)
    {
        $status = $request->input('status');
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days'));
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

    public function getRequestsDescription(Request $request)
    {
        $status = $request->input('status');
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
        
        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-10 days'));
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d'); // Default to today
        }

        $query = DB::table('user_requests')
            ->whereBetween(DB::raw('DATE(dateRequested)'), [$startDate, $endDate]);

        if ($status === 'Total') {
            $requestData = $query->get();
        } elseif ($status === 'Closed') {
            $requestData = $query->where('status', 'closed')->get();
        } else {

            return response()->json(['error' => 'Invalid status']);
        }

        Log::info($requestData);

        return response()->json(['requestData' => $requestData]);
    }


    public function technicianTable(Request $request)
    {
        $admins = User::where('role', 'admin')->get();

        $data = [];

        foreach ($admins as $admin) {

            $adminName = $admin->userFirstName . ' ' . $admin->userLastName;

            $adminRequestsQuery = Requests::where('assignedTo', $adminName);

            if ($request->has('fromDate')) {
                $fromDate = $request->input('fromDate');
                $adminRequestsQuery->whereDate('dateRequested', '>=', $fromDate);
            }

            if ($request->has('toDate')) {
                $toDate = $request->input('toDate');
                $adminRequestsQuery->whereDate('dateRequested', '<=', $toDate);
            }

            $adminRequests = $adminRequestsQuery->get();

            $totalRequests = $adminRequests->count();

            if ($totalRequests === 0) {
                $closedRequests = 0;
                $unclosedRequests = 0;
                $performance = 0;
                $totalRating = 0;
            } else {
                $closedRequests = Requests::where('assignedTo', $adminName)
                    ->where('status', 'Closed')
                    ->count();
                $unclosedRequests = Requests::where('assignedTo', $adminName)
                    ->whereIn('status', ['On Progress', 'To Release', 'To Rate'])
                    ->count();
                $performance = ($totalRequests > 0) ? ($closedRequests / $totalRequests) * 100 : 0;

                $totalRating = RateServices::whereIn('request_id', $adminRequests->pluck('id')->toArray())
                    ->selectRaw('SUM(q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8) as total')
                    ->value('total');

                $overallRating = RateServices::whereIn('request_id', $adminRequests->pluck('id')->toArray())->count();

                if ($overallRating > 0) {
                    $totalRating = ($totalRating / ($overallRating * 40)) * 100;
                } else {
                    $totalRating = '0';
                }

                $performance = number_format($performance, 2) . '%';
                $totalRating = number_format($totalRating, 2) . '%';
            }

            $adminData = [
                'technician' => $adminName,
                'all_req' => $totalRequests,
                'closed_req' => $closedRequests,
                'unclosed_req' => $unclosedRequests,
                'performance' => $performance,
                'rating' => $totalRating,
            ];

            $data[] = $adminData;
        }

        usort($data, function ($a, $b) {
            return $b['performance'] <=> $a['performance'];
        });

        usort($data, function ($a, $b) {
            return $b['rating'] <=> $a['rating'];
        });

        return response()->json(['data' => $data]);
    }

    public function summaryList(Request $request)
    {

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days'));
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d');
        }

        $selectClause = [
            'user_requests.request_code',
            'receive_service.dateReceived',
            'user_requests.reqOffice',
            'user_requests.unit',
            'user_requests.natureOfRequest',
            'receive_service.updated_at',
            'receive_service.remarks',
            DB::raw("COALESCE(release_requests.dateReleased, ' ') as dateReleased"), // Handle blank value for dateReleased
            'receive_service.toRecommend'
        ];

        $query = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->leftJoin('release_requests', 'receive_service.id', '=', 'release_requests.receivedReq_id')
            ->select($selectClause)
            ->where([
                ['user_requests.request_code', '<>', 'n/a'],
                ['receive_service.dateReceived', '<>', 'n/a'],
                ['user_requests.reqOffice', '<>', 'n/a'],
                ['user_requests.unit', '<>', 'n/a'],
                ['user_requests.natureOfRequest', '<>', 'n/a'],
            ])
            ->whereIn('user_requests.status', ['Closed', 'To Rate', 'To Release'])
            ->where('receive_service.toRecommend', '<>', 'n/a')
            ->where('receive_service.remarks', '<>', 'n/a');

        $query->where('user_requests.dateRequested', '>=', $startDate)
            ->where('user_requests.dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));

            
        $requests = $query->get();

        foreach ($requests as $request) {
            $processingHours = $this->calculateProcessingHours($request->dateReceived, $request->dateReleased);
            $request->processing_hours = $processingHours . ' hrs';
        }

        foreach ($requests as $request) {
            if ($request->dateReleased === ' ') {
                $request->processing_hours = ' ';
                $request->toRecommend = 'Unclaimed';
            } else {
                $processingHours = $this->calculateProcessingHours($request->dateReceived, $request->dateReleased);
                $request->processing_hours = $processingHours . ' hrs';
            }
        }

        $totalRequestsCountQuery = clone $query;
        $totalRequestsCountQuery->whereIn('user_requests.status', ['Closed', 'To Rate']);
        $totalRequestsCount = $totalRequestsCountQuery->count();
        $totalReleasedMessage = ($totalRequestsCount > 0) ? "{$totalRequestsCount} unit Released" : "0 unit Released";

        $sevenDaysAgo = now()->subDays(7);
        $formattedSevenDaysAgo = $sevenDaysAgo->format('Y-m-d H:i:s');
        $unclaimedRequestsCountQuery = clone $query;
        $unclaimedRequestsCountQuery->where('user_requests.status', 'To Release')
            ->whereDate('user_requests.dateRequested', '<=', $formattedSevenDaysAgo);
        $unclaimedRequestsCount = $unclaimedRequestsCountQuery->count();
        $unclaimedRequestsMessage = ($unclaimedRequestsCount > 0) ? "{$unclaimedRequestsCount} unit Unclaimed" : "0 unit Unclaimed";

        $defectRequestsCountQuery = clone $query;
        $defectRequestsCount = $defectRequestsCountQuery
            ->whereIn('user_requests.status', ['Closed', 'To Rate'])
            ->where(function ($query) {
                $query->where('receive_service.toRecommend', 'LIKE', '%Defective%')
                    ->orWhere('receive_service.toRecommend', 'LIKE', '%Defect%')
                    ->orWhere('receive_service.toRecommend', 'LIKE', '%Defected%');
            })
            ->count();

        $defectRequestsCount = $defectRequestsCountQuery->count();
        $defectRequestsMessage = ($defectRequestsCount > 0) ? "{$defectRequestsCount} unit Defect" : "0 unit Defect";

        $response = [
            'requests' => $requests,
            'totalReleased' => $totalReleasedMessage,
            'totalUnclaimed' => $unclaimedRequestsMessage,
            'totalDefect' => $defectRequestsMessage,
        ];
        return $response;
    }

    private function calculateProcessingHours($updatedAt, $dateReceived)
    {
        $updatedAt = new \DateTime($updatedAt);
        $dateReceived = new \DateTime($dateReceived);
        $diff = $updatedAt->diff($dateReceived);

        return ($diff->days * 24) + $diff->h;
    }

    public function artaDelay()
    {
        $delayData = DB::table('user_requests')
            ->select('user_requests.id', 'user_requests.request_code', 'user_requests.dateRequested', 'user_requests.natureOfRequest', 'receive_service.serviceBy', 'receive_service.arta', 'arta_cause_delay.reasonDelay', 'arta_cause_delay.reasonDelay as causeOfDelay', 'arta_cause_delay.dateReason as dateOfDelay')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->join('arta_cause_delay', 'user_requests.id', '=', 'arta_cause_delay.request_id')
            ->where('receive_service.artaStatus', '=', 'Delay')
            ->get();

        return response()->json(['results' => $delayData]);
    }


    public function delayReport(Request $request)
    {
        $query = DB::table('user_requests')
            ->select('user_requests.id', 'user_requests.request_code', 'user_requests.dateRequested', 'user_requests.natureOfRequest', 'receive_service.serviceBy', 'receive_service.arta', 'arta_cause_delay.reasonDelay', 'arta_cause_delay.reasonDelay as causeOfDelay', 'arta_cause_delay.dateReason as dateOfDelay')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->join('arta_cause_delay', 'user_requests.id', '=', 'arta_cause_delay.request_id')
            ->where('receive_service.artaStatus', '=', 'Delay');

        if ($request->has('fromDate')) {
            $fromDate = $request->input('fromDate');
            $query->whereDate('user_requests.dateRequested', '>=', $fromDate);
        }

        if ($request->has('toDate')) {
            $toDate = $request->input('toDate');
            $query->whereDate('user_requests.dateRequested', '<=', $toDate);
        }

        $requests = $query->get();

        return $requests;
    }
}
