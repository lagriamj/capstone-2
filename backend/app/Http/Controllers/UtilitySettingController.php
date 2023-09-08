<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UtilitySetting;
use App\Models\Department;

class UtilitySettingController extends Controller
{
    public function index()
    {
        $utility = UtilitySetting::all();
        return response()->json([
            'results' => $utility
        ], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'utilityCategory' => 'required',
        ]);

        $utility = UtilitySetting::create($validatedData);
        return response()->json($utility, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'utilityCategory' => 'required',
        ]);

        $utility = UtilitySetting::findOrFail($id);
        $utility->update($validatedData);
        return response()->json($utility, 200);
    }

    public function destroy($id)
    {
        $utility = UtilitySetting::find($id);

        if (!$utility) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $utility->delete();
        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);
    }



    public function showOffice()
    {
        $office = Department::all();
        return response()->json([
            'results' => $office
        ], 200);
    }

    public function addOffice(Request $request)
    {
        $validatedData = $request->validate([
            'office' => 'required',
            'head' => 'required',
        ]);

        $office = Department::create($validatedData);
        return response()->json($office, 201);
    }

    public function destroyOffice($id)
    {
        $office = Department::find($id);

        if (!$office) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $office->delete();
        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);
    }

    public function updateOffice(Request $request)
    {
        try {
            $office = Department::find($request->input('id'));

            if (!$office) {
                return response()->json([
                    'message' => 'Department not found.'
                ], 404);
            }

            $office->update([
                'office' => $request->input('office'),
                'head' => $request->input('head'),
            ]);
            return response()->json(['message' => 'Department data updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating department data'], 500);
        }
    }
}
