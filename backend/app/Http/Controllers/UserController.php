<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Twilio\Rest\Client;
use Illuminate\Database\Eloquent\Model;

class UserController extends Controller
{
    //
        public function register(Request $request)
        {
            $request->validate([
                'userFirstName' => 'required',
                'userLastName' => 'required',
                'userGovernmentID' => 'required',
                'userEmail' => 'required|email',
                'userContactNumber' => 'required|min:11',
                'userPassword' => 'required|min:6',
            ]);

            $otpCode = mt_rand(100000, 999999);
            $otpExpiration = now()->addMinutes(15);
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




            return response()->json(['message' => 'User registered succesfully', 'userID' => $user->userID, 'userContactNumber' => $user->userContactNumber], 201);
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
            // Handle exception if SMS sending fails
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
}