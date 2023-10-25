<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceiveService extends Model
{
    use HasFactory;
    protected $table = 'receive_service';
    protected $primaryKey = 'id';
    protected $fillable = [
        'request_id',
        'receivedBy',
        'dateReceived',
        'assignedTo',
        'serviceBy',
        'arta',
        'dateServiced',
        'toRecommend',
        'findings',
        'rootCause',
        'actionTaken',
        'remarks',
    ];
}
