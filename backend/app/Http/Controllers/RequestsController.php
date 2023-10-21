<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;
use App\Models\Requests;
use App\Models\CutOffTime;
use App\Models\User;
use Carbon\Carbon;

class RequestsController extends Controller
{
    public function showRequest(Request $request, $userID, $startDate = null, $endDate = null)
    {
        $query = Requests::where('status', '!=', 'Cancelled')
            ->where('status', '!=', 'Closed')
            ->where('status', '!=', 'Purge');

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

        $requests = $query->get();
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

        // Create the Requests record with timestamps
        $requestRecord = Requests::create($validatedData);

        // Insert data into the receive_service table with the obtained request_id
        DB::table('receive_service')->insert([
            'request_id' => $requestRecord->id,
            'receivedBy' => 'n/a',
            'dateReceived' => $now,
            'assignedTo' => 'n/a',
            'serviceBy' => 'n/a',
            'dateServiced' => $now,
            'toRecommend' => 'n/a',
            'findings' => 'n/a',
            'rootCause' => 'n/a',
            'actionTaken' => 'n/a',
            'remarks' => 'n/a',
            'created_at' => $now, // Add created_at timestamp
            'updated_at' => $now, // Add updated_at timestamp
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
}