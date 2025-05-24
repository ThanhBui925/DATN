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
        Schema::create('variant_products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->unsignedBigInteger('product_id');
            $table->string('name', 255);
            $table->integer('quantity');
            $table->unsignedBigInteger('size_id');
            $table->unsignedBigInteger('color_id');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_products');
    }
};
