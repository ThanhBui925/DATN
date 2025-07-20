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
        Schema::table('addresses', function (Blueprint $table) {
            // Thêm user_id column
            $table->unsignedBigInteger('user_id')->nullable()->after('customer_id');
            
            // Thêm foreign key cho user_id
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Thêm các column còn thiếu theo model
            $table->string('province_name')->nullable()->after('address');
            $table->string('district_name')->nullable()->after('province_name');
            $table->string('ward_name')->nullable()->after('district_name');
            $table->string('recipient_email')->nullable()->after('recipient_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'province_name', 'district_name', 'ward_name', 'recipient_email']);
        });
    }
}; 