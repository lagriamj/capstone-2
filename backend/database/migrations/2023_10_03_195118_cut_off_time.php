<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cut_off_time', function (Blueprint $table) {
            $table->id();
            $table->datetime('cut_off');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cut_off_time');
    }
};
