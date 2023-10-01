<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\UserSignature;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSignatureController extends Controller
{
    public function userSignature(Request $request)
    {
        $request->validate([
            'governmentID' => 'required|string',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'office' => 'required|string',
            'signatureImage' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('signatureImage')) {
            $image = $request->file('signatureImage');
            $filename = $image->getClientOriginalName();
            $storagePath = $image->storeAs('user_signatures', $filename);

            $userSignature = new UserSignature();
            $userSignature->governmentID = $request->input('governmentID');
            $userSignature->firstName = $request->input('firstName');
            $userSignature->lastName = $request->input('lastName');
            $userSignature->office = $request->input('office');
            $userSignature->signatureImage = $filename;
            $userSignature->role = 'user';
            $userSignature->save();
            return response()->json(['message' => 'Authorized signature added successfully']);
        }
        return response()->json(['message' => 'No file uploaded.']);
    }


    public function allSignature($fullName)
    {
        $authorizedSignatures = UserSignature::whereRaw("CONCAT(firstName, ' ', lastName) = ?", [$fullName])->get();
        return response()->json($authorizedSignatures);
    }

    /*public function getSignature($filename)
    {
        $path = storage_path('app/user_signatures/' . $filename);

        if (!Storage::exists('user_signatures/' . $filename)) {
            abort(404);
        }
        return response()->file($path);
    } */
    public function getSignature()
    {
        $fullName = request('fullName');
        try {
            Log::info('Querying for name: ' . $fullName);
            $userSignature = UserSignature::whereRaw("CONCAT(firstName, ' ', lastName) = ?", [$fullName])->first();

            // Get the signature image filename
            $signatureFilename = $userSignature->signatureImage;

            $path = storage_path('app/user_signatures/' . $signatureFilename);


            if (!Storage::exists('user_signatures/' . $signatureFilename)) {
                throw new \Exception('Signature file not found');
            }

            return response()->file($path, ['Content-Type' => 'image/png']);
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
        $fullName = request('fullName');
        try {
            $userSignature = UserSignature::whereRaw("CONCAT(firstName, ' ', lastName) = ?", [$fullName])->first();

            if ($userSignature) {
                return $userSignature->signatureImage;
            } else {
                return null; // Return null if user signature not found
            }
        } catch (\Exception $e) {
            Log::error('Error while retrieving filename: ' . $e->getMessage());
            return null; // Handle the error as needed
        }
    }


    public function updateSignature(Request $request, $fullName)
    {
        $request->validate([
            'signatureImage' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $userSignature = UserSignature::whereRaw("CONCAT(firstName, ' ', lastName) = ?", [$fullName])->first();

        if (!$userSignature) {
            return response()->json(['message' => 'User signature not found'], 404);
        }

        if ($request->hasFile('signatureImage')) {
            $image = $request->file('signatureImage');
            $filename = $image->getClientOriginalName();
            $storagePath = $image->storeAs('user_signatures', $filename);

            $userSignature->signatureImage = $filename;
            $userSignature->save();

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
            return response()->json(['error' => 'No matching user request found.'], 404);
        }

        $reqOffice = $userRequest->reqOffice;
        $authorizedSignatures = UserSignature::where('office', $reqOffice)->get();

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
