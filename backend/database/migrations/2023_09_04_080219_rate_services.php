<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rate_services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('userID')->on('users');
            $table->unsignedBigInteger('request_id');
            $table->foreign('request_id')->references('id')->on('user_requests');
            $table->datetime('dateRate');
            $table->string('department'); // Fixed typo 'derpartment' to 'department'
            $table->string('q1');
            $table->string('q2');
            $table->string('q3');
            $table->string('q4');
            $table->string('q5');
            $table->string('q6');
            $table->string('q7');
            $table->string('q8');
            $table->string('commendation');
            $table->string('suggestion');
            $table->string('request');
            $table->string('complaint');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rate_services');
    }
};
