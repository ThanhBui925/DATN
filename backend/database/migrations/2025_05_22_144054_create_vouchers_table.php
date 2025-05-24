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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('code', 50)->unique();
            $table->decimal('discount', 10, 2);
            $table->enum('discount_type', ['fixed', 'percentage']);
            $table->dateTime('expiry_date')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('description');
            $table->integer('usage_limit')->nullable();
            $table->integer('usage_count')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
