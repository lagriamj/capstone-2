<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requests extends Model
{
    use HasFactory;
    protected $table = 'user_requests';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'reqOffice',
        'division',
        'natureOfRequest',
        'dateRequested',
        'modeOfRequest',
        'unit',
        'propertyNo',
        'serialNo',
        'authorizedBy',
        'dateProcured',
        'specialIns',
        'status',
        'assignedTo',
        'dateUpdated',
    ];
}
