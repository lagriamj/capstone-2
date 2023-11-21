<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->id('userID');
            $table->string('userLastName', 50);
            $table->string('userFirstName', 50);
            $table->string('userGovernmentID', 20);
            $table->string('userEmail', 50)->unique();
            $table->string('userContactNumber', 20);
            $table->string('userPassword', 100);
            $table->string('userStatus', 20);
            $table->date('dateRegistered');
            $table->string('role', 5);
            $table->string('otpCode', 6);
            $table->timestamp('otpExpiration');
            $table->boolean('password_change_required');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
