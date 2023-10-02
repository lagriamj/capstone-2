<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('audit_log', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('office');
            $table->string('action');
            $table->string('reference');
            $table->datetime('date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('audit_log');
    }
};
