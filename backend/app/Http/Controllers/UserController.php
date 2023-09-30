<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Twilio\Rest\Client;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;

class UserController extends Controller
{
    //
    public function register(Request $request)
    {
        $request->validate([
            'userFirstName' => 'required',
            'userLastName' => 'required',
            'office' => 'required',
            'division' => 'required',
            'userGovernmentID' => 'required|unique:users',
            'userEmail' => 'required|email|unique:users',
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
        $user->office = $request->office;
        $user->division = $request->division;
        $user->userEmail = $request->userEmail;
        $user->userContactNumber = $request->userContactNumber;

        $truncatedPassword = Str::limit($request->userPassword, $maxPasswordLength);
        $user->userPassword = bcrypt($truncatedPassword); // Hash the truncated password

        // Check if the request is coming from an admin
        if ($request->input('adminUserRole') === 'admin') {
            // If it's an admin, use the provided role and status
            $user->userStatus = $request->input('userStatus');
            $user->role = $request->input('role');
        } else {
            // If it's a regular user, set default role and status
            $user->userStatus = 'unverified';
            $user->role = 'user';
        }

        /*$sendingSuccess = $this->sendVerificationCode($user, $otpCode);

            if (!$sendingSuccess) {
                return response()->json(['message' => 'SMS sending failed'], 500);
            }*/

        $user->dateRegistered = now();
        $user->otpCode = $otpCode;
        $user->otpExpiration = $otpExpiration;

        $user->save();
        $user->userID = $user->userID;

        if ($user->save()) {
            return response()->json(['message' => 'User registered successfully', 'userID' => $user->userID, 'userContactNumber' => $user->userContactNumber], 201);
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
        $newContactNumber = $request->input('userContactNumber');
        $newOffice = $request->input('office');
        $newDivision = $request->input('division');
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
        $user->userContactNumber = $newContactNumber;
        $user->office = $newOffice;
        $user->division = $newDivision;

        if (!empty($newPassword)) {
            $user->userPassword = Hash::make($newPassword);
        }

        $user->save();
        return response()->json(['message' => 'Updated successfully']);
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

    public function showUsersList()
    {
        $users = User::select([
            'userID',
            'userLastName',
            'userFirstName',
            'userGovernmentID',
            'office',
            'division',
            'userEmail',
            'userContactNumber',
            'userStatus',
            'dateRegistered',
            'role',
            'otpCode',
            'otpExpiration',
            'created_at',
            'updated_at'
        ])->get();;






        return response()->json(['result' => $users], 200);
    }

    public function update(Request $request)
    {
        try {
            // Retrieve the user based on the user ID from the request
            $user = User::findOrFail($request->input('userID'));

            // Update user data
            $user->update([
                'userFirstName' => $request->input('userFirstName'),
                'userLastName' => $request->input('userLastName'),
                'userGovernmentID' => $request->input('userGovernmentID'),
                'userEmail' => $request->input('userEmail'),
                'office' => $request->input('office'),
                'division' => $request->input('division'),
                'userContactNumber' => $request->input('userContactNumber'),
                'userStatus' => $request->input('userStatus'),
                'role' => $request->input('role'),
            ]);

            // Optionally, update the user's password if a new password is provided
            if ($request->filled('userPassword')) {
                $user->update(['userPassword' => Hash::make($request->input('userPassword'))]);
            }

            return response()->json(['message' => 'User data updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating user data'], 500);
        }
    }

    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $user->delete();
        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);
    }

    public function deleteSelectedUsers(Request $request)
    {
        $selectedUserIDs = $request->input('selectedUserIDs', []);

        if (empty($selectedUserIDs)) {
            return response()->json(['message' => 'No users selected for deletion'], 400);
        }

        try {
            // Perform the bulk deletion
            User::whereIn('userID', $selectedUserIDs)->delete();

            return response()->json(['message' => 'Selected users deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting selected users'], 500);
        }
    }
}
