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
        Schema::create('shop_order', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_order');
            $table->decimal('total_price', 10, 2);
            $table->enum('order_status', ['confirming', 'confirmed', 'preparing', 'shipping', 'delivered', 'completed', 'canceled', 'pending'])->default('pending');
            $table->string('cancel_reason')->nullable();
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->string('shipping_address', 255);
            $table->enum('payment_method', ['cash', 'card', 'paypal', 'vnpay']);
            $table->dateTime('shipped_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('shipping_id');
            $table->string('recipient_name', 255);
            $table->string('recipient_phone', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_orders');
    }
};
