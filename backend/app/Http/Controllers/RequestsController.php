<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;
use App\Models\Requests;
use App\Models\CutOffTime;
use App\Models\User;
use App\Models\ArtaReason;
use Carbon\Carbon;

class RequestsController extends Controller
{
    public function showRequest(Request $request, $userID, $startDate = null, $endDate = null)
    {
        $query = DB::table('user_requests')
            ->whereNotIn('status', ['Cancelled', 'Closed', 'Purge']);

        $startDateTime = Carbon::now();
        $startDateTime->setTime(1, 5, 0);

        $endDateTime = Carbon::now();
        $endDateTime->setTime(23, 59, 0);

        $recordsToPurge  = Requests::where('status', 'Pending')
            ->where('dateRequested', '<', $startDateTime)
            ->where('dateRequested', '<', $endDateTime)
            ->get();

        foreach ($recordsToPurge as $record) {
            $record->update(['status' => 'Purge']);
        }

        if ($userID) {
            $query->where('user_id', $userID);
        }

        if ($startDate && $endDate) {
            $query->where('dateRequested', '>=', $startDate)
                ->where('dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));
        }

        $requests = $query
            ->leftJoin('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
            ->select('user_requests.*', 'receive_service.*')
            ->get();


        return response()->json([
            'results' => $requests
        ], 200);
    }


    public function addRequest(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required',
            'fullName' => 'required',
            'reqOffice' => 'required',
            'division' => 'required',
            'natureOfRequest' => 'required',
            'modeOfRequest' => 'required',
            'unit' => 'required',
            'propertyNo' => 'required',
            'serialNo' => 'required',
            'authorizedBy' => 'required',
            'yearProcured' => 'required',
            'specialIns' => 'nullable',
            'status' => 'required',
            'assignedTo' => 'required',
        ]);

        $currentYear = date('Y');
        $latestRequest = Requests::where('request_code', 'like', $currentYear . '-%')
            ->orderBy('request_code', 'desc')
            ->first();

        $sequenceNumber = 1;

        if ($latestRequest) {
            $latestSequenceNumber = intval(substr($latestRequest->request_code, -3));
            $sequenceNumber = $latestSequenceNumber + 1;
        }

        $formattedSequenceNumber = str_pad($sequenceNumber, 3, '0', STR_PAD_LEFT);
        $requestCode = $currentYear . '-' . $formattedSequenceNumber . 'C';

        $validatedData['request_code'] = $requestCode;
        $now = now();
        $validatedData['dateRequested'] = $now;
        $validatedData['dateUpdated'] = $now;

        $requestRecord = Requests::create($validatedData);

        if ($request->input('modeOfRequest') === 'Walk-In') {
            $requestRecord->update(['approved' => 'yes-signature']);
        }

        $user = DB::table('users')
            ->where('userID', $validatedData['user_id'])
            ->first();

        if ($user && $user->role === 'admin') {
            $requestRecord->update(['approved' => 'yes-signature']);
        }


        $requestRecord->save();

        DB::table('receive_service')->insert([
            'request_id' => $requestRecord->id,
            'receivedBy' => 'n/a',
            'dateReceived' => $now,
            'assignedTo' => 'n/a',
            'serviceBy' => 'n/a',
            'arta' => 'n/a',
            'dateServiced' => $now,
            'artaStatus' => 'n/a',
            'toRecommend' => 'n/a',
            'findings' => 'n/a',
            'rootCause' => 'n/a',
            'actionTaken' => 'n/a',
            'remarks' => 'n/a',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return response()->json($requestRecord, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'user_id' => 'required',
            'fullName' => 'required',
            'reqOffice' => 'required',
            'division' => 'required',
            'natureOfRequest' => 'required',
            'dateRequested' => 'required',
            'modeOfRequest' => 'required',
            'unit' => 'required',
            'propertyNo' => 'required',
            'serialNo' => 'required',
            'authorizedBy' => 'required',
            'yearProcured' => 'required',
            'specialIns' => 'nullable',
            'status' => 'required',
            'assignedTo' => 'required',
            'dateUpdated' => 'required',
        ]);

        $users = Requests::findOrFail($id);
        $users->update($validatedData);

        return response()->json($users, 200);
    }

    public function destroyRequest($id)
    {
        $userRequest = Requests::find($id);

        if (!$userRequest) {
            return response()->json([
                'message' => 'User request not found.'
            ], 404);
        }

        // Update the status to "Cancel"
        $userRequest->status = 'Cancelled';
        $userRequest->save();

        return response()->json([
            'message' => 'User request status updated to Cancel successfully.'
        ], 200);
    }

    public function getOfficeAndDivision($userID)
    {

        $user = User::find($userID);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userData = [
            'office' => $user->office,
            'division' => $user->division,
        ];

        return response()->json($userData);
    }

    public function cutOffRequest(Request $request)
    {
        $validatedData = $request->validate([
            'cutOff' => 'required|date_format:Y-m-d\TH:i',
        ]);

        $existingCutOffTime = CutOffTime::first();

        if ($existingCutOffTime) {
            $existingCutOffTime->update([
                'cut_off' => $validatedData['cutOff'],
            ]);
        } else {
            $cutOffTime = new CutOffTime();
            $cutOffTime->cut_off = $validatedData['cutOff'];
            $cutOffTime->save();
        }

        return response()->json(['message' => 'Cut-off time saved successfully'], 201);
    }

    public function getCutOffTime()
    {
        try {
            $cutOffTime = CutOffTime::first();

            if (!$cutOffTime) {
                return response()->json(['message' => 'No cut-off time set yet.'], 200);
            }
            return response()->json(['message' => 'Cut-off time found', 'cutOffTime' => $cutOffTime->cut_off], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch cut-off time'], 500);
        }
    }

    public function resetCutOffTime()
    {
        $cutOffstartDateTime = Carbon::now();
        $cutOffstartDateTime->setTime(1, 0, 0);

        $cutOffendDateTime = Carbon::now();
        $cutOffendDateTime->setTime(11, 59, 0);

        $cutOffTimeToDelete = CutOffTime::where('cut_off', '<', $cutOffstartDateTime)
            ->where('cut_off', '<', $cutOffendDateTime)
            ->get();

        if ($cutOffTimeToDelete->count() > 0) {
            CutOffTime::query()->delete();
        }
    }

    public function getRequestsThreshold(Request $request)
    {
        $userRequests = DB::table('user_requests')
            ->select('propertyNo', 'serialNo', 'unit', DB::raw('COUNT(*) as count'))
            ->where('status', 'Closed')
            ->groupBy('propertyNo', 'serialNo', 'unit')
            ->having('count', '>=', 5)
            ->get();

        $result = [];
        $totalCount = 0;

        foreach ($userRequests as $request) {
            $message = ($request->count >= 10) ? 'for waste' : 'for replacement';
            $totalCount += $request->count;

            $allThresholdRequest = DB::table('user_requests')
                ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
                ->join('release_requests', 'receive_service.id', '=', 'release_requests.receivedReq_id')
                ->where('propertyNo', $request->propertyNo)
                ->orWhere('serialNo', $request->serialNo)
                ->select('user_requests.*', 'receive_service.*', 'release_requests.*')
                ->get();

            $result[] = [
                'propertyNo' => $request->propertyNo,
                'serialNo' => $request->serialNo,
                'unit' => $request->unit,
                'message' => $message,
                'total_count' => $totalCount,

            ];
        }
        return response()->json($result);
    }

    public function getThresholdHistory(Request $request)
    {
        $userRequests = DB::table('user_requests')
            ->select('propertyNo', 'serialNo', 'unit', DB::raw('COUNT(*) as count'))
            ->where('status', 'Closed')
            ->groupBy('propertyNo', 'serialNo', 'unit')
            ->having('count', '>=', 5)
            ->get();

        $result = [];
        $totalCount = 0;

        foreach ($userRequests as $request) {
            $message = ($request->count >= 10) ? 'for waste' : 'for replacement';
            $totalCount += $request->count;

            $allThresholdRequest = DB::table('user_requests')
                ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
                ->join('release_requests', 'receive_service.id', '=', 'release_requests.receivedReq_id')
                ->where('propertyNo', $request->propertyNo)
                ->orWhere('serialNo', $request->serialNo)
                ->select('user_requests.dateRequested', 'receive_service.serviceBy', 'receive_service.rootCause', 'receive_service.remarks')
                ->get();

            $result[] = [
                'allThresholdRequest' => $allThresholdRequest,
            ];
        }
        return response()->json($result);
    }

    public function addArtaReason(Request $request)
    {
        $data = $request->all();

        $artaCauseDelay = new ArtaReason();
        $artaCauseDelay->request_id = $data['request_id'];
        $artaCauseDelay->reasonDelay = $data['reasonDelay'];
        $artaCauseDelay->dateReason = now();
        $artaCauseDelay->save();

        return response()->json(['message' => 'Data added successfully']);
    }

    public function showArtaReason($id)
    {
        $artaCauseDelayData = ArtaReason::where('request_id', $id)->get();
        return response()->json(['data' => $artaCauseDelayData]);
    }
}