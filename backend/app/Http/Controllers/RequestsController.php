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
    public function showRequest(Request $request)
    {
        $userID = $request->input('userID');
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        if ($startDate === null) {
            $startDate = date('Y-m-d', strtotime('-30 days'));
        }

        if ($endDate === null) {
            $endDate = date('Y-m-d');
        }

        $query = DB::table('user_requests')
            ->whereNotIn('status', ['Cancelled', 'Closed', 'Purge']);

        $startDateTime = Carbon::now();
        $startDateTime->setTime(1, 5, 0);

        $endDateTime = Carbon::now();
        $endDateTime->setTime(23, 59, 0);

        $recordsToPurge = Requests::where('status', 'Pending')
            ->where('dateRequested', '<', $startDateTime)
            ->where('dateRequested', '<', $endDateTime)
            ->get();

        foreach ($recordsToPurge as $record) {
            $record->update(['status' => 'Purge']);
        }

        if ($userID) {
            $query->where('user_id', $userID);
        }

        $query->where('dateRequested', '>=', $startDate)
            ->where('dateRequested', '<', date('Y-m-d', strtotime($endDate . ' + 1 day')));

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
            ->orderByRaw('CAST(SUBSTRING_INDEX(request_code, "-", -1) AS SIGNED) DESC')
            ->orderBy('request_code', 'desc')
            ->first();

        $sequenceNumber = 1;

        if ($latestRequest) {
            $latestSequenceNumber = intval(substr($latestRequest->request_code, -4));

            if (strpos($latestRequest->request_code, '-') !== false) {
                $latestSequenceNumber = intval(substr($latestRequest->request_code, -5));
            }

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

        if ($user && $user->role === 'head') {
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

    public function updateRequest(Request $request, $id)
    {
        $validatedData = $request->validate([
            'natureOfRequest' => 'required',
            'unit' => 'required',
            'propertyNo' => 'required',
            'serialNo' => 'required',
            'yearProcured' => 'required',
            'specialIns' => 'nullable',
        ]);

        $validatedData['dateUpdated'] = now();

        $updated = Requests::where('id', $id)->update($validatedData);

        if ($updated) {
            return response()->json(['message' => 'Request updated successfully']);
        }
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
        $cutOffendDateTime->setTime(23, 59, 0);

        $cutOffTimeToDelete = CutOffTime::where('cut_off', '<', $cutOffstartDateTime)
            ->where('cut_off', '<', $cutOffendDateTime)
            ->get();

        if ($cutOffTimeToDelete->count() > 0) {
            CutOffTime::where('cut_off', '<', $cutOffstartDateTime)
                ->where('cut_off', '<', $cutOffendDateTime)
                ->update(['cut_off' => now()->setTime(17, 0, 0)]);
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

        foreach ($userRequests as $request) {
            $message = ($request->count >= 5) ? 'for disposal' : '';

            $allThresholdRequest = DB::table('user_requests')
                ->join('receive_service', 'user_requests.id', '=', 'receive_service.request_id')
                ->join('release_requests', 'receive_service.id', '=', 'release_requests.receivedReq_id')
                ->where('propertyNo', $request->propertyNo)
                ->where('serialNo', $request->serialNo)
                ->where('unit', $request->unit)
                ->select('user_requests.*', 'receive_service.*', 'release_requests.*')
                ->get();

            $result[] = [
                'propertyNo' => $request->propertyNo,
                'serialNo' => $request->serialNo,
                'unit' => $request->unit,
                'message' => $message,
                'total_count' => $request->count,
            ];
        }
        return response()->json($result);
    }

    public function getThresholdHistory(Request $request)
    {
        $propertyNo = $request->input('propertyNo');
        $serialNo = $request->input('serialNo');
        $unit = $request->input('unit');

        $userRequests = DB::table('user_requests')
            ->select('id', 'request_code', 'dateRequested', 'assignedTo')
            ->where('propertyNo', $propertyNo)
            ->where('serialNo', $serialNo)
            ->where('unit', $unit)
            ->get();

        return response()->json($userRequests);
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
