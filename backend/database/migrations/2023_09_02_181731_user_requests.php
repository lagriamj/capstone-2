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
            $table->unsignedBigInteger('user_id'); // Foreign key column
            $table->foreign('user_id')->references('userID')->on('users'); // Use 'userID' as the reference column
            $table->string('fullName');
            $table->string('reqOffice');
            $table->string('division');
            $table->string('natureOfRequest');
            $table->datetime('dateRequested');
            $table->string('modeOfRequest');
            $table->string('unit');
            $table->integer('propertyNo');
            $table->integer('serialNo');
            $table->string('authorizedBy');
            $table->date('dateProcured');
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
