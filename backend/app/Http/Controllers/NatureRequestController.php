<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NatureRequest;

class NatureRequestController extends Controller
{
    public function showNature()
    {
        $natures = NatureRequest::all();
        return response()->json([
            'results' => $natures
        ], 200);
    }

    public function addNature(Request $request)
    {
        $validatedData = $request->validate([
            'natureRequest' => 'required',
        ]);

        $natures = NatureRequest::create($validatedData);
        return response()->json($natures, 201);
    }

    public function destroyNature($id)
    {
        $natures = NatureRequest::find($id);

        if (!$natures) {
            return response()->json([
                'message' => 'Nature of Request not found.'
            ], 404);
        }

        $natures->delete();
        return response()->json([
            'message' => 'Nature of Request deleted successfully.'
        ], 200);
    }

    public function updateNature(Request $request)
    {
        try {
            $natures = NatureRequest::find($request->input('id'));

            if (!$natures) {
                return response()->json([
                    'message' => 'Nature of Request not found...'
                ], 404);
            }

            $natures->update([
                'natureRequest' => $request->input('natureRequest'),
            ]);
            return response()->json(['message' => 'Nature of Request data updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating Nature of Request data'], 500);
        }
    }
}
