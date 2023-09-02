<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UtilitySetting extends Model
{
    use HasFactory;
    protected $table = 'utility_setting';
    protected $primaryKey = 'id';
    protected $fillable = [
        'utilityCategory',
    ];
}
