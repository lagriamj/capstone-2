<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function countPendingUserRequests()
    {
        $count = DB::table('user_requests')->where('status', 'Pending')->count();
        return response()->json(['count' => $count], 200);
    }

    public function countAllUsers()
    {
        $count = DB::table('users')->count();
        return response()->json(['count' => $count], 200);
    }

    public function countReceivedUserRequests()
    {
        $count = DB::table('user_requests')->where('status', 'Received')->count();
        return response()->json(['count' => $count], 200);
    }

    public function countClosedUserRequests()
    {
        $count = DB::table('user_requests')->where('status', 'Closed')->count();
        return response()->json(['count' => $count], 200);
    }
}
