<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NatureRequest;

class NatureRequestController extends Controller
{
    public function index()
    {
        $natures = NatureRequest::all();
        return response()->json([
            'results' => $natures
        ], 200);
    }
}
