<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function showAuditLog()
    {
        try {
            // Retrieve all audit log records
            $auditLogs = AuditLog::all();

            return response()->json(['auditLogs' => $auditLogs], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch audit logs'], 500);
        }
    }
}
