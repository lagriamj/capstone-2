<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technician extends Model
{
    use HasFactory;
    protected $table = 'technicians';
    protected $primaryKey = 'id';
    protected $fillable = [
        'technician',
    ];
}
