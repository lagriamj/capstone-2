<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_code')->unique();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('userID')->on('users');
            $table->string('fullName');
            $table->string('reqOffice');
            $table->string('division');
            $table->string('natureOfRequest');
            $table->datetime('dateRequested');
            $table->string('modeOfRequest');
            $table->string('unit');
            $table->string('propertyNo');
            $table->string('serialNo');
            $table->string('authorizedBy');
            $table->string('yearProcured');
            $table->string('specialIns');
            $table->string('status');
            $table->string('assignedTo');
            $table->datetime('dateUpdated');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_requests');
    }
};