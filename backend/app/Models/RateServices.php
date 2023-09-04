<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RateServices extends Model
{
    use HasFactory;
    protected $table = 'rate_services';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'request_id',
        'dateRate',
        'department',
        'q1',
        'q2',
        'q3',
        'q4',
        'q5',
        'q6',
        'q7',
        'q8',
        'commendation',
        'suggestion',
        'request',
        'complaint',
    ];
}
