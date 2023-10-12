<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\UserSignature;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSignatureController extends Controller
{
    public function userSignature(Request $request)
    {
        $request->validate([
            'governmentID' => 'required|string',
            'signatureImage' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('signatureImage')) {
            $image = $request->file('signatureImage');
            $filename = $image->getClientOriginalName();
            $storagePath = $image->storeAs('user_signatures', $filename);

            $userSignature = new UserSignature();
            $userSignature->governmentID = $request->input('governmentID');
            $userSignature->signatureImage = $filename;
            $userSignature->save();
            return response()->json(['message' => 'Authorized signature added successfully']);
        }
        return response()->json(['message' => 'No file uploaded.']);
    }

    public function allSignature($userID)
    {
        $id = User::where('userID', $userID)->pluck('userGovernmentID')->first();

        $authorizedSignatures = UserSignature::where('governmentID', $id)->get();
        return response()->json($authorizedSignatures);
    }

    public function getSignature($filename)
    {
        $path = storage_path('app/user_signatures/' . $filename);

        if (!Storage::exists('user_signatures/' . $filename)) {
            abort(404);
        }
        return response()->file($path);
    }

    public function getSignatureInAccount()
    {
        $userID = request('userID');
        $id = User::where('userID', $userID)->pluck('userGovernmentID')->first();

        try {
            Log::info('Querying for userID: ' . $userID);
            $userSignature = UserSignature::where('governmentID', $id)->first();

            if (!$userSignature) {
                throw new ModelNotFoundException('User signature not found');
            }

            $signatureFilename = $userSignature->signatureImage;
            $path = storage_path('app/user_signatures/' . $signatureFilename);

            if (!Storage::exists('user_signatures/' . $signatureFilename)) {
                throw new \Exception('Signature file not found');
            }

            return response()->file($path, ['Content-Type' => 'image/png/jpg/jpeg']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User signature not found'], 404);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Database error'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getFileName()
    {
        $userID = request('userID');
        $id = User::where('userID', $userID)->pluck('userGovernmentID')->first();

        if ($id) {
            $userSignature = UserSignature::where('governmentID', $id)->first();

            if ($userSignature) {
                return $userSignature->signatureImage;
            } else {
                return null;
            }
        }

        Log::error('User or user signature not found for userID: ' . $userID);
        return null;
    }


    public function updateSignature(Request $request, $userID)
    {
        $request->validate([
            'signatureImage' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = User::where('userID', $userID)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $governmentID = $user->userGovernmentID;

        $userSignature = UserSignature::where('governmentID', $governmentID)->first();

        if (!$userSignature) {
            return response()->json(['message' => 'User signature not found'], 404);
        }

        if ($request->hasFile('signatureImage')) {
            $image = $request->file('signatureImage');
            $filename = $image->getClientOriginalName();

            $userSignature->signatureImage = $filename;
            $userSignature->save();
            $image->storeAs('user_signatures', $filename);

            return response()->json(['message' => 'User signature updated successfully']);
        }
        return response()->json(['message' => 'No file uploaded.']);
    }


    public function approvedAuthorSign($request_id)
    {
        $userRequest = DB::table('user_requests')
            ->where('id', $request_id)
            ->where('approved', 'yes-signature')
            ->select('reqOffice')
            ->first();

        if (!$userRequest) {
            return response()->json(['message' => 'Request is not yet approved by an authorized person.']);
        }

        $reqOffice = $userRequest->reqOffice;
        $authorized = User::where('office', $reqOffice)
            ->where('role', 'head')
            ->select('userGovernmentID')
            ->first();

        if (!$authorized) {
            return response()->json(['message' => 'No authorized person found for the given office.']);
        }

        $govID = $authorized->userGovernmentID;
        $authorizedSignatures = UserSignature::where('governmentID', $govID)
            ->get();

        return response()->json($authorizedSignatures);
    }

    public function getApprovedSignature($filename)
    {
        $path = storage_path('app/user_signatures/' . $filename);

        if (!Storage::exists('user_signatures/' . $filename)) {
            abort(404);
        }
        return response()->file($path);
    }
}
