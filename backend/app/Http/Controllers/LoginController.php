<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class LoginController extends Controller
{
    //
    public function login(Request $request)
    {
        $credentials = $request->only('userGovernmentID', 'userPassword');

        $user = User::where('userGovernmentID', $credentials['userGovernmentID'])->first();

        if ($user) {
            // Use Hash::check to compare the user-provided plain password with the hashed password
            if (Hash::check($credentials['userPassword'], $user->userPassword)) {
                if ($user->userStatus === 'verified') {
                    Auth::login($user);

                    return response()->json([
                        'success' => true,
                        'userID' => $user->userID,
                        'role' => $user->role,
                        'userStatus' => 'verified',
                    ]);
                } else {
                    return response()->json([
                        'success' => true,
                        'userID' => $user->userID,
                        'contactNumber' => $user->userContactNumber,
                        'userStatus' => 'unverified',
                    ]);
                }
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid government ID or password.',
        ], 401);
    }
}