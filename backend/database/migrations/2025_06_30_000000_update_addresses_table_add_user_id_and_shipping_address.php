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
            
            // Thêm shipping_address column
            $table->string('shipping_address')->nullable()->after('address');
            
            // Thêm recipient_email column
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
            $table->dropColumn(['user_id', 'shipping_address', 'recipient_email']);
        });
    }
}; 