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
        Schema::create('cancel_reason', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id'); // Foreign key column
            $table->foreign('request_id')->references('id')->on('user_requests');
            $table->string('reason');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancel_reason');
    }
};
