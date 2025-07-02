<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {
            // Các trường bổ sung
            // $table->string('avatar')->nullable()->after('address');
            // $table->date('dob')->nullable()->after('avatar');
            // $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('dob');
        });
    }

    public function down()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'dob', 'gender']);
            $table->dropForeign(['user_id']);
            $table->dropUnique(['user_id']);
        });
    }
};
