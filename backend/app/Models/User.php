<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userFirstName',
        'userLastName',
        'userGovernmentID',
        'office',
        'division',
        'userEmail',
        'userContactNumber',
        'userPassword',
        'userStatus',
        'dateRegistered',
        'role',
        'otpCode',
        'otpExpiration',
    ];

    protected $primaryKey = "userID";

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'otpExpiration' => 'datetime',
        'dateRegistered' => 'datetime',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
