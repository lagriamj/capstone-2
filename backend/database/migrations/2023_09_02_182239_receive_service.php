<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receive_service', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id'); // Foreign key column
            $table->foreign('request_id')->references('id')->on('user_requests'); // Use 'userID' as the reference column
            $table->string('receivedBy');
            $table->datetime('dateReceived');
            $table->string('assignedTo');
            $table->string('serviceBy');
            $table->datetime('dateServiced');
            $table->string('toRecommend');
            $table->string('findings');
            $table->string('rootCause');
            $table->string('actionTaken');
            $table->string('remarks');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('receive_service');
    }
};
