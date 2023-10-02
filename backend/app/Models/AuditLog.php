<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;
    protected $table = 'audit_log';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'office',
        'action',
        'reference',
        'date',
    ];
}
