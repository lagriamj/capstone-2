<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Requests;
use App\Models\User;
use Carbon\Carbon;

class RequestsController extends Controller
{
    public function showRequest(Request $request)
    {
        $userID = $request->input('user_id');
        $query = Requests::where('status', '!=', 'Cancelled')
            ->where('status', '!=', 'Closed');



        $startDateTime = Carbon::now();
        $startDateTime->setTime(6, 5, 0);

        $endDateTime = Carbon::now();
        $endDateTime->setTime(23, 59, 0);

        $recordsToDelete = Requests::where('status', 'Pending')
            ->where('dateRequested', '<', $startDateTime)
            ->where('dateRequested', '<', $endDateTime)
            ->get();

        foreach ($recordsToDelete as $record) {
            $record->delete();
        }

        if ($userID) {
            $query->where('user_id', $userID);
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
            'modeOfRequest' => '',
            'unit' => 'required',
            'propertyNo' => 'required',
            'serialNo' => 'required',
            'authorizedBy' => 'required',
            'dateProcured' => 'required',
            'specialIns' => 'nullable',
            'status' => 'required',
            'assignedTo' => 'required',

        ]);

        $validatedData['dateRequested'] = now();
        $validatedData['dateUpdated'] = now();
        $validatedData['modeOfRequest'] = "Online";

        $request = Requests::create($validatedData);

        return response()->json($request, 201);
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
            'dateProcured' => 'required',
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
}
