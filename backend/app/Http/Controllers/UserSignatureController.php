<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\UserSignature;

class UserSignatureController extends Controller
{
    public function userSignature(Request $request)
    {
        $request->validate([
            'governmentID' => 'required|string',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'office' => 'required|string',
            'signatureImage' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
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

    public function getSignature($filename)
    {
        $path = storage_path('app/user_signatures/' . $filename);

        if (!Storage::exists('user_signatures/' . $filename)) {
            abort(404);
        }
        return response()->file($path);
    }
}
