<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NatureRequest extends Model
{
    use HasFactory;
    protected $table = 'nature_request';
    protected $primaryKey = 'id';
    protected $fillable = [
        'natureRequest',
    ];
}
