<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RateServices;
use App\Models\ReceiveService;
use App\Models\Requests;
use Illuminate\Support\Facades\DB;


class RatingController extends Controller
{

    public function showTransanction(Request $request, $id, $startDate = null, $endDate = null, $selectedStatus = null, $selectedSort = null, $search = null)
    {

        $order = $request->input('order');

        $query = DB::table('user_requests')
            ->select('user_requests.*')
            ->whereNotIn('status', ['Pending', 'Received', 'On Progress', 'To Release', 'To Rate'])
            ->where('user_id', $id);


        if ($startDate && $endDate) {
            // Use '<' for the end date to exclude it from the range
            $query->where('user_requests.dateRequested', '>=', $startDate)
                ->where('user_requests.dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));
        }

        if ($order && in_array($order, ['asc', 'desc'])) {
            $query->orderByRaw("dateUpdated $order");
        }

        if ($selectedStatus && in_array($selectedStatus, ['Closed', 'Cancelled'])) {
            $query->where('status', $selectedStatus);
        }

        if ($search) {
            $search = preg_replace('/^E-/i', '', $search); // Remove 'E-' or 'e-' prefix
            $query->where(function ($query) use ($search) {
                $query->where('id', 'LIKE', "%$search%")
                    ->orWhere('natureOfRequest', 'LIKE', "%$search%")
                    ->orWhere('assignedTo', 'LIKE', "%$search%");
            });
        }



        $data = $query->get();

        return response()->json(['results' => $data]);
    }


    public function showServiceTransanction(Request $request, $startDate = null, $endDate = null, $selectedStatus = null, $selectedSort = null, $search = null)
    {

        $order = $request->input('order');

        $query = DB::table('user_requests')
            ->select('user_requests.*')
            ->whereNotIn('status', ['Pending', 'Received', 'On Progress', 'To Release', 'To Rate']);


        if ($startDate && $endDate) {
            // Use '<' for the end date to exclude it from the range
            $query->where('user_requests.dateRequested', '>=', $startDate)
                ->where('user_requests.dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));
        }

        if ($order && in_array($order, ['asc', 'desc'])) {
            $query->orderByRaw("dateUpdated $order");
        }

        if ($selectedStatus && in_array($selectedStatus, ['Closed', 'Cancelled'])) {
            $query->where('status', $selectedStatus);
        }

        if ($search) {
            $search = preg_replace('/^E-/i', '', $search); // Remove 'E-' or 'e-' prefix
            $query->where(function ($query) use ($search) {
                $query->where('id', 'LIKE', "%$search%")
                    ->orWhere('natureOfRequest', 'LIKE', "%$search%")
                    ->orWhere('assignedTo', 'LIKE', "%$search%");
            });
        }

        $data = $query->get();

        return response()->json(['results' => $data]);
    }

    public function closedView($id)
    {
        $closedData = DB::table('user_requests')
            ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->join('release_requests', 'receive_service.id', '=', 'release_requests.receivedReq_id')
            ->where('user_requests.id', $id)
            ->select('user_requests.*', 'receive_service.*', 'release_requests.*')
            ->get();

        return response()->json(['results' => $closedData]);
    }

    public function rateTransaction(Request $request)
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

    public function closedNorate($id)
    {
        $request = Requests::find($id);

        if (!$request) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        $request->status = 'Closed';
        $request->dateUpdated = now();
        $request->save();

        return response()->json(['message' => 'Request has been closed']);
    }


    public function doneRating()
    {
        $requests = DB::table('rate_services')->select('request_id')->get();

        return response()->json(['results' => $requests]);
    }


    public function viewRating($id)
    {
        $requests = DB::table('rate_services')
            ->where('request_id', $id)
            ->get();

        return response()->json(['results' => $requests]);
    }
}
