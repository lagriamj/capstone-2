<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancelReason extends Model
{
    use HasFactory;
    protected $table = 'cancel_reason';
    protected $primaryKey = 'id';
    protected $fillable = [
        'request_id',
        'reason'
    ];
}
