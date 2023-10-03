<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CutOffTime extends Model
{
    use HasFactory;
    protected $table = 'cut_off_time';
    protected $primaryKey = 'id';
    protected $fillable = [
        'cut_off',
    ];
}
