<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Department;
use App\Models\ReceiveService;
use App\Models\Requests;
use App\Models\User;
use App\Models\UserSignature;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
            'userPassword' => 'required|min:5',
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

        $sendOTP = $this->sendVerificationCode($user, $otpCode);

        if (!$sendOTP) {
            return response()->json(['message' => 'Verification sending failed'], 500);
        }

        $user->dateRegistered = now();
        $user->otpCode = $otpCode;
        $user->otpExpiration = $otpExpiration;

        $user->save();
        $user->userID = $user->userID;

        if ($user->save()) {
            return response()->json(['message' => 'User registered successfully', 'userID' => $user->userID, 'userEmail' => $user->userEmail], 201);
        } else {
            return response()->json(['message' => 'The government ID is already taken.'], 422);
        }
    }

    public function registerNoOTP(Request $request)
    {
        $request->validate([
            'userFirstName' => 'required',
            'userLastName' => 'required',
            'office' => 'required',
            'division' => 'required',
            'userGovernmentID' => 'required|unique:users',
            'userEmail' => 'required|email|unique:users',
            'userContactNumber' => 'required|min:11',
            'userPassword' => 'required|min:5',
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

        $user->dateRegistered = now();
        $user->otpCode = $otpCode;
        $user->otpExpiration = $otpExpiration;

        $user->save();
        $user->userID = $user->userID;

        if ($user->save()) {
            return response()->json(['message' => 'User registered successfully', 'userID' => $user->userID, 'userEmail' => $user->userEmail], 201);
        } else {
            return response()->json(['message' => 'The government ID is already taken.'], 422);
        }
    }

    public function checkEmail(Request $request)
    {
        $email = $request->input("email");
        $user = User::where("userEmail", $email)->first();

        $otpCode = mt_rand(100000, 999999);
        $otpExpiration = now()->addMinutes(10);

        if (!$user) {
            // Email does not exist
            return response()->json(['message' => 'Email not found'], 404);
        } else {
            $user->otpCode = $otpCode;
            $user->otpExpiration = $otpExpiration;
            $user->save();
        }

        $sendOTP = $this->sendVerificationCode($user, $otpCode);

        if (!$sendOTP) {
            return response()->json(['message' => 'Verification sending failed'], 500);
        }

        return response()->json(['otpCode' => $otpCode, 'message' => 'Sending OTP successfull'], 200);
    }

    public function checkOTP(Request $request)
    {
        $email = $request->input('email');
        // Find the user by email
        $user = User::where('userEmail', $email)->first();

        if (!$user) {
            // Email not found
            return response()->json(['message' => 'Email not found'], 404);
        }

        if ($user->otpCode !== $request->otpCode) {
            // Invalid OTP
            return response()->json(['message' => ' Nganong Invalid OTP mannnnnnnn'], 400);
        } elseif ($user->otpExpiration < now()) {
            // OTP has expired
            return response()->json(['message' => 'OTP has expired'], 400);
        } else {
            // OTP is valid
            return response()->json(['message' => 'OTP is valid'], 200);
        }
    }

    public function newPassword(Request $request)
    {
        $request->validate([
            'newPassword' => 'required|min:6',
        ], [
            'newPassword.required' => 'The new password field is required it must be atleast 6 characters long.',
            'newPassword.min' => 'The new password must be at least 6 characters long.',
        ]);

        $email = $request->input('email');
        $newPassword = $request->userPassword;
        // Find the user by email
        $user = User::where('userEmail', $email)->first();




        if (!$user) {
            // Email not found
            return response()->json(['message' => 'Email not found'], 404);
        }

        $maxPasswordLength = 50;

        $truncatedPassword = Str::limit($newPassword, $maxPasswordLength);
        $user->userPassword = bcrypt($truncatedPassword); // 
        $user->save();

        return response()->json(['message' => "Successfully changed password"]);
    }

    private function sendVerificationCode(User $user, $otpCode)
    {

        $otpMessage = $otpCode ? "Your verification code is: <strong style='color: red;'>" . $otpCode . "</strong><br><br>" : "";
        $messageContent = $otpMessage . "Note: <strong>Your password will be your office name + last name. E.g. (CITCPadilla) </strong>";

        Mail::html($messageContent . $otpCode, function ($message) use ($user) {
            $message->subject('OTP Verification');
            $message->to($user->userEmail);
        });

        return response()->json(['message' => 'Successfully sent an otp']);
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

        $userId = $request->userId;
        $email = $request->email;

        if ($userId) {
            $user = User::find($userId);
        } elseif ($email) {
            $user = User::where('userEmail', $email)->first();
        } else {
            return response()->json(['message' => 'User ID or email is required'], 400);
        }

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $otpCode = mt_rand(100000, 999999);
        $otpExpiration = now()->addMinutes(15);

        $user->otpCode = $otpCode;
        $user->otpExpiration = $otpExpiration;

        $sendOTP = $this->sendVerificationCode($user, $otpCode);

        if (!$sendOTP) {
            return response()->json(['message' => 'Verification sending failed'], 500);
        }

        $user->save();

        return response()->json(['message' => 'New OTP code has been sent'], 200);
    }

    public function updateEmail(Request $request)
    {
        $userID = $request->userID;

        $user = User::find($userID);



        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $newUserEmail = $request->input('newUserEmail');

        $user->userEmail = $newUserEmail;
        $user->save();

        return response()->json(['message' => 'Email number updated successfully']);
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
        $userCurrentName = $user->userFirstName . ' ' . $user->userLastName;

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


        $newUserName = $request->input('userFirstName') . ' ' . $request->input('userLastName');

        if ($request->input('role') === 'admin') {
            $requestsToUpdate = Requests::where('assignedTo', $userCurrentName)->get();

            foreach ($requestsToUpdate as $requestToUpdate) {
                $requestToUpdate->update(['assignedTo' => $newUserName]);
                $requestToUpdate->save();
            }
            $receiveToUpdate = ReceiveService::where('serviceBy', $userCurrentName)->get();

            foreach ($receiveToUpdate as $requestToUpdate) {
                $requestToUpdate->update(['serviceBy' => $newUserName]);
                $requestToUpdate->save();
            }

            $receiveToReleaseUpdate = ReceiveService::where('assignedTo', $userCurrentName)->get();

            foreach ($receiveToReleaseUpdate as $requestToUpdateAssignedTo) {
                $requestToUpdateAssignedTo->update(['assignedTo' => $newUserName]);
                $requestToUpdateAssignedTo->save();
            }
            $receivedByUpdate = ReceiveService::where('receivedBy', $userCurrentName)->get();

            foreach ($receivedByUpdate as $requestToUpdateAssignedTo) {
                $requestToUpdateAssignedTo->update(['receivedBy' => $newUserName]);
                $requestToUpdateAssignedTo->save();
            }

            $requestsToUpdateLog = AuditLog::where('name', $userCurrentName)->get();
            foreach ($requestsToUpdateLog as $logToUpdate) {
                $logToUpdate->update(['name' => $newUserName]);
                $logToUpdate->save();
            }
        } else if ($request->input('role') === 'head') {
            $departmentToUpdate = Department::where('head', $userCurrentName)->get();

            foreach ($departmentToUpdate as $requestToUpdate) {
                $requestToUpdate->update(['head' => $newUserName]);
                $requestToUpdate->save();
            }

            $requestsToUpdate = Requests::where('authorizedBy', $userCurrentName)->get();

            foreach ($requestsToUpdate as $requestToUpdate) {
                $requestToUpdate->update(['authorizedBy' => $newUserName]);
                $requestToUpdate->save();
            }
        } else if ($request->input('role') === 'user') {
            $requestsToUpdate = Requests::where('fullName', $userCurrentName)->get();

            foreach ($requestsToUpdate as $requestToUpdate) {
                $requestToUpdate->update(['fullName' => $newUserName]);
                $requestToUpdate->save();
            }
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
            'isActive',
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
            $userCurrentName = $user->userFirstName . ' ' . $user->userLastName;

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
                'isActive' => $request->input('isActive'),
                'role' => $request->input('role'),
            ]);



            $newUserName = $request->input('userFirstName') . ' ' . $request->input('userLastName');

            if ($request->input('role') === 'admin') {
                $requestsToUpdate = Requests::where('assignedTo', $userCurrentName)->get();

                foreach ($requestsToUpdate as $requestToUpdate) {
                    $requestToUpdate->update(['assignedTo' => $newUserName]);
                    $requestToUpdate->save();
                }
                $receiveToUpdate = ReceiveService::where('serviceBy', $userCurrentName)->get();

                foreach ($receiveToUpdate as $requestToUpdate) {
                    $requestToUpdate->update(['serviceBy' => $newUserName]);
                    $requestToUpdate->save();
                }

                $receiveToReleaseUpdate = ReceiveService::where('assignedTo', $userCurrentName)->get();

                foreach ($receiveToReleaseUpdate as $requestToUpdateAssignedTo) {
                    $requestToUpdateAssignedTo->update(['assignedTo' => $newUserName]);
                    $requestToUpdateAssignedTo->save();
                }
                $receivedByUpdate = ReceiveService::where('receivedBy', $userCurrentName)->get();

                foreach ($receivedByUpdate as $requestToUpdateAssignedTo) {
                    $requestToUpdateAssignedTo->update(['receivedBy' => $newUserName]);
                    $requestToUpdateAssignedTo->save();
                }

                $requestsToUpdateLog = AuditLog::where('name', $userCurrentName)->get();
                foreach ($requestsToUpdateLog as $logToUpdate) {
                    $logToUpdate->update(['name' => $newUserName]);
                    $logToUpdate->save();
                }
            } else if ($request->input('role') === 'head') {
                $departmentToUpdate = Department::where('head', $userCurrentName)->get();

                foreach ($departmentToUpdate as $requestToUpdate) {
                    $requestToUpdate->update(['head' => $newUserName]);
                    $requestToUpdate->save();
                }

                $requestsToUpdate = Requests::where('authorizedBy', $userCurrentName)->get();

                foreach ($requestsToUpdate as $requestToUpdate) {
                    $requestToUpdate->update(['authorizedBy' => $newUserName]);
                    $requestToUpdate->save();
                }
            } else if ($request->input('role') === 'user') {
                $requestsToUpdate = Requests::where('fullName', $userCurrentName)->get();

                foreach ($requestsToUpdate as $requestToUpdate) {
                    $requestToUpdate->update(['fullName' => $newUserName]);
                    $requestToUpdate->save();
                }
            }

            // Optionally, update the user's password if a new password is provided
            if ($request->filled('userPassword')) {
                $user->update(['userPassword' => Hash::make($request->input('userPassword'))]);
            }

            $userSignature = UserSignature::where('governmentID', $user->userGovernmentID)->first();

            if ($userSignature) {
                $userSignature->update([
                    'governmentID' => $request->input('userGovernmentID'),
                ]);
            }

            return response()->json(['message' => 'User data updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
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

        $user->update(['isActive' => 0]);
        return response()->json([
            'message' => 'User  successfully.'
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
            User::whereIn('userID', $selectedUserIDs)->update(['isActive' => false]);

            return response()->json(['message' => 'Selected users Inactive successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating users'], 500);
        }
    }

    public function showTechnicians()
    {

        $technicians = User::where('role', 'admin')
            ->where('isActive', 1)
            ->get();
        return response()->json(['result' => $technicians], 200);
    }

    public function showHeads()
    {
        $heads = User::where('role', 'head')->get();
        return response()->json(['result' => $heads], 200);
    }
}
