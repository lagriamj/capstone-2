<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthorizedSignature extends Model
{
    use HasFactory;
    protected $table = 'authorized_signature';
    protected $primaryKey = 'id';
    protected $fillable = [
        'authorized',
        'file_path'
    ];
}
