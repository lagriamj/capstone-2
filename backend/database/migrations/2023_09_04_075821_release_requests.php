<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('release_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('receivedReq_id'); // Foreign key column
            $table->foreign('receivedReq_id')->references('id')->on('receive_service'); // Use 'userID' as the reference column
            $table->string('approvedBy');
            $table->datetime('dateApproved');
            $table->string('noteBy');
            $table->datetime('dateNoted');
            $table->string('releasedBy');
            $table->datetime('dateReleased');
            $table->string('received_By');
            $table->datetime('date_Received');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('release_requests');
    }
};
