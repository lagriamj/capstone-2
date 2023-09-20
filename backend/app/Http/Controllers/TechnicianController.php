<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Technician;
use App\Models\User;

class TechnicianController extends Controller
{
    public function showTechnician()
    {
        $adminUsers = User::where('role', 'admin')->get(['userFirstName', 'userLastName']);

        return response()->json([
            'results' => $adminUsers
        ], 200);
    }

    public function addTechnician(Request $request)
    {
        $validatedData = $request->validate([
            'technician' => 'required',
        ]);

        $tech = Technician::create($validatedData);
        return response()->json($tech, 201);
    }

    public function destroyTechnician($id)
    {
        $tech = Technician::find($id);

        if (!$tech) {
            return response()->json([
                'message' => 'Technician not found.'
            ], 404);
        }

        $tech->delete();
        return response()->json([
            'message' => 'Technician deleted successfully.'
        ], 200);
    }

    public function updateTechnician(Request $request)
    {
        try {
            $tech = Technician::find($request->input('id'));

            if (!$tech) {
                return response()->json([
                    'message' => 'Technician not found.'
                ], 404);
            }

            $tech->update([
                'technician' => $request->input('technician'),
            ]);
            return response()->json(['message' => 'Technician data updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating technician data'], 500);
        }
    }
}
