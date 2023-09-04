<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReleaseRequests extends Model
{
    use HasFactory;
    protected $table = 'release_requests';
    protected $primaryKey = 'id';
    protected $fillable = [
        'receivedReq_id',
        'approvedBy',
        'dateApproved',
        'noteBy',
        'dateNoted',
        'releasedBy',
        'dateReleased',
        'received_By',
        'date_Received',
    ];
}
