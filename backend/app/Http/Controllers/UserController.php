<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Twilio\Rest\Client;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //
    public function register(Request $request)
    {
        $request->validate([
            'userFirstName' => 'required',
            'userLastName' => 'required',
            'userGovernmentID' => 'required|unique:users',
            'userEmail' => 'required|email',
            'userContactNumber' => 'required|min:11',
            'userPassword' => 'required|min:6',
        ]);

        $otpCode = mt_rand(100000, 999999);
        $otpExpiration = now()->addMinutes(10);
        $maxPasswordLength = 50;

        $user = new User();
        $user->userFirstName = $request->userFirstName;
        $user->userLastName = $request->userLastName;
        $user->userGovernmentID = $request->userGovernmentID;
        $user->userEmail = $request->userEmail;
        $user->userContactNumber = $request->userContactNumber;


        $truncatedPassword = Str::limit($request->userPassword, $maxPasswordLength);
        $user->userPassword = bcrypt($truncatedPassword); // Hash the truncated password


        $user->userStatus = 'unverified'; // Set user status
        $user->dateRegistered = now();
        $user->role = "user";
        $user->otpCode = $otpCode;
        $user->otpExpiration = $otpExpiration;

        /*$sendingSuccess = $this->sendVerificationCode($user, $otpCode);

            if (!$sendingSuccess) {
                return response()->json(['message' => 'SMS sending failed'], 500);
            }*/

        $user->save();
        $user->userID = $user->userID;


        if ($user->save()) {
            return response()->json(['message' => 'User registered succesfully', 'userID' => $user->userID, 'userContactNumber' => $user->userContactNumber], 201);
        } else {
            return response()->json(['message' => 'The government ID is already taken.'], 422);
        }
    }

    private function sendVerificationCode(User $user, $otpCode)
    {
        $client = new Client(getenv("TWILIO_SID"), getenv("TWILIO_AUTH_TOKEN"));

        try {
            $client->messages->create(
                '+' . $user->userContactNumber,
                [
                    'from' => getenv("TWILIO_PHONE_NUMBER"),
                    'body' => "Your verification code is: " . htmlspecialchars($otpCode),
                ]
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed sending verification code',
            ]); // Indicate that sending failed
        }

        return true; // Indicate that sending was successful
    }


    public function verifyOTP(Request $request)
    {
        $action = $request->action;

        if ($action === 'confirm') {
            $userId = $request->userId;

            $request->validate([
                'otpCode' => 'required|numeric',
                'userId' => 'required'
            ]);

            $user = User::find($userId);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            if ($user->otpCode !== $request->otpCode) {
                return response()->json(['message' => 'Invalid OTP code'], 400);
            }

            if (now() > $user->otpExpiration) {
                return response()->json(['message' => 'OTP code has expired'], 400);
            }

            $user->userStatus = 'verified';
            $user->save();

            return response()->json(['message' => 'OTP verification successful'], 200);
        } else {
            return response()->json(['message' => 'Invalid action'], 400);
        }
    }

    public function resendOTP(Request $request)
    {
        $action = $request->action; // Fetch the action parameter

        if ($action === 'resend') {
            $userId = $request->userId;

            $user = User::find($userId);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $otpCode = mt_rand(100000, 999999);
            $otpExpiration = now()->addMinutes(15);

            $user->otpCode = $otpCode;
            $user->otpExpiration = $otpExpiration;

            /*$sendingSuccess = $this->sendVerificationCode($user, $otpCode);

            if (!$sendingSuccess) {
                return response()->json(['message' => 'SMS sending failed'], 500);
            }*/

            $user->save();

            return response()->json(['message' => 'New OTP code has been sent'], 200);
        } else {
            return response()->json(['message' => 'Invalid action'], 400);
        }
    }

    public function updatePhoneNumber(Request $request)
    {
        $userID = $request->userID;

        $user = User::find($userID);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $newContactNumber = $request->input('newContactNumber');

        // Validate the new contact number if needed

        $user->userContactNumber = $newContactNumber;
        $user->save();

        return response()->json(['message' => 'Contact number updated successfully']);
    }

    public function accountDetails(Request $request)
    {
        $userID = $request->input('userID');
        $query = User::query();

        if ($userID) {
            $query->where('userID', $userID);
        }

        $requests = $query->get();

        return response()->json([
            'results' => $requests
        ], 200);
    }

    public function changePassword(Request $request)
    {
        $currentPassword = $request->input('currentPassword');
        $newPassword = $request->input('newPassword');
        $newFirstName = $request->input('userFirstName');
        $newLastName = $request->input('userLastName');
        $newEmail = $request->input('userEmail');
        $userID = $request->input('userID');
        $user = User::find($userID);

        if (!empty($currentPassword)) {
            if (!Hash::check($currentPassword, $user->userPassword)) {
                return response()->json(['message' => 'Current password is incorrect'], 401);
            }
        }

        $user->userFirstName = $newFirstName;
        $user->userLastName = $newLastName;
        $user->userEmail = $newEmail;

        if (!empty($newPassword)) {
            $user->userPassword = Hash::make($newPassword);
        }

        $user->save();
        return response()->json(['message' => 'Password, FirstName, LastName, and Email changed successfully']);
    }

    public function checkPassword(Request $request)
    {
        $password = $request->password;
        $userID = $request->userID;

        $user = User::find($userID);


        if (!Hash::check($password, $user->userPassword)) {
            return response()->json(['message' => 'Password is incorrect'], 401);
        } else {
            return response()->json(['message' => 'Password is correct'], 200);
        }
    }

    public function updateContactNumber(Request $request)
    {

        $newContactNumber = $request->newContactNumber;
        $userID = $request->userID;

        $user = User::find($userID);

        $user->userContactNumber = $newContactNumber;
        $user->save();

        return response()->json(['message' => 'Updated Successfully'], 200);
    }
}
