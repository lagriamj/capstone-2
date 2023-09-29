<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\AuthorizedSignature;

class AuthorizedSignController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'authorized' => 'required|string',
            'file_path' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('file_path')) {
            $image = $request->file('file_path');
            $filename = $image->getClientOriginalName();
            $storagePath = $image->storeAs('authorized_signatures', $filename);

            $authorizedSignature = new AuthorizedSignature();
            $authorizedSignature->authorized = $request->input('authorized');
            $authorizedSignature->file_path = $filename;
            $authorizedSignature->save();

            return response()->json(['message' => 'Authorized signature added successfully']);
        }
        return response()->json(['message' => 'No file uploaded.']);
    }

    public function index()
    {
        // Fetch all authorized persons and their images.
        $authorizedSignatures = AuthorizedSignature::all();

        // Return the data as JSON.
        return response()->json($authorizedSignatures);
    }
    public function getImage($filename)
    {
        $path = storage_path('app/authorized_signatures/' . $filename);

        if (!Storage::exists('authorized_signatures/' . $filename)) {
            abort(404); // Return a 404 response if the image doesn't exist.
        }

        return response()->file($path);
    }
}
