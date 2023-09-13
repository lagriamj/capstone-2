<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateUserRequestsAutoIncrement extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('ALTER TABLE user_requests AUTO_INCREMENT = 1000;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // You can add rollback logic here if needed, but for AUTO_INCREMENT changes,
        // it's typically not necessary to have a rollback operation.
    }
}
