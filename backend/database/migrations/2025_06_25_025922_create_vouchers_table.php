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
            $table->string('code', 50)->unique(); // Mã voucher

            $table->enum('discount_type', ['fixed', 'percentage']); // Kiểu giảm
            $table->decimal('discount', 10, 2); // Giá trị giảm
            $table->decimal('max_discount_amount', 10, 2)->nullable(); // Giảm tối đa (nếu giảm theo %)
            $table->decimal('min_order_amount', 10, 2)->nullable(); // Đơn tối thiểu

            $table->integer('usage_limit')->nullable(); // Giới hạn tổng số lượt
            $table->integer('usage_limit_per_user')->nullable(); // Giới hạn mỗi người
            $table->integer('usage_count')->default(0); // Đã dùng

            $table->tinyInteger('is_public')->default(1); // Public hay riêng
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // Nếu là voucher riêng

            $table->dateTime('start_date')->nullable(); // Ngày bắt đầu
            $table->dateTime('expiry_date')->nullable(); // Ngày hết hạn
            $table->tinyInteger('status')->default('1'); // Trạng thái
            $table->enum('applies_to', ['all', 'product', 'category'])->default('all');
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
