<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class RouteController extends Controller
{
    //
    public function getUserRole() {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Get the authenticated user's ID
            $userID = Auth::user()->userID;
            
            // Fetch the user's role based on the user's ID
            $user = User::find($userID); // Replace 'User' with your actual User model
            $userRole = $user->role; // Assuming your role column is named 'role'
            
            return response()->json([
                'role' => $userRole,
            ]);
        }
        
        return response()->json([
            'message' => 'User is not authenticated.',
        ], 401);
    }
}
