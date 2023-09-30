<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_signature', function (Blueprint $table) {
            $table->id();
            $table->string('governmentID');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('office');
            $table->string('signatureImage');
            $table->string('role');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_signature');
    }
};
