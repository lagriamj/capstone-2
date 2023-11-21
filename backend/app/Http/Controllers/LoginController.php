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
                    if (!Auth::check()) {
                        if ($user) {
                            Auth::login($user);
                        } else {
                            redirect('/login');
                        }
                    }

                    return response()->json([
                        'userID' => $user->userID,
                        'role' => $user->role,
                        'firstName' => $user->userFirstName,
                        'lastName' => $user->userLastName,
                        'userStatus' => 'verified',
                        'isActive' => $user->isActive,
                        'password_change_required' => $user->password_change_required,

                    ]);
                } else {
                    return response()->json([
                        'success' => true,
                        'userID' => $user->userID,
                        'userEmail' => $user->userEmail,
                        'userStatus' => 'unverified',
                        'isActive' => $user->isActive,
                        'password_change_required' => $user->password_change_required,
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
