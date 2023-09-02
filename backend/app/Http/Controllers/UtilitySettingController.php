<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UtilitySetting;

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
}
