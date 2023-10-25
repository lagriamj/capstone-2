<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtaReason extends Model
{
    use HasFactory;
    protected $table = 'arta_cause_delay';
    protected $primaryKey = 'id';
    protected $fillable = [
        'request_code',
        'reasonDelay',
        'dateReason',
    ];
}
