<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSignature extends Model
{
    use HasFactory;
    protected $table = 'user_signature';
    protected $primaryKey = 'id';
    protected $fillable = [
        'governmentID',
        'signatureImage',
    ];
}
