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
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });

        Schema::table('images', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('restrict');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });

        Schema::table('role_has_permissions', function (Blueprint $table) {
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('restrict');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('restrict');
        });

        Schema::table('shop_order', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
            $table->foreign('shipping_id')->references('id')->on('shipping')->onDelete('restrict');
        });

        Schema::table('shop_order_items', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('shop_order')->onDelete('restrict');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->foreign('variant_id')->references('id')->on('variant_products')->onDelete('restrict');
        });

        Schema::table('shopping_cart', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });

        Schema::table('shopping_cart_item', function (Blueprint $table) {
            $table->foreign('cart_id')->references('id')->on('shopping_cart')->onDelete('restrict');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->foreign('variant_id')->references('id')->on('variant_products')->onDelete('restrict');
        });

        Schema::table('variant_products', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->foreign('size_id')->references('id')->on('sizes')->onDelete('restrict');
            $table->foreign('color_id')->references('id')->on('colors')->onDelete('restrict');
        });

        Schema::table('voucher_user', function (Blueprint $table) {
            $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('restrict');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('order_id')->references('id')->on('shop_order')->onDelete('set null');
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('images', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropForeign(['user_id']);
        });

        Schema::table('role_has_permissions', function (Blueprint $table) {
            $table->dropForeign(['permission_id']);
            $table->dropForeign(['role_id']);
        });

        Schema::table('shop_order', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['shipping_id']);
        });

        Schema::table('shop_order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['variant_id']);
        });

        Schema::table('shopping_cart', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('shopping_cart_item', function (Blueprint $table) {
            $table->dropForeign(['cart_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['variant_id']);
        });

        Schema::table('variant_products', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropForeign(['size_id']);
            $table->dropForeign(['color_id']);
        });

        Schema::table('voucher_user', function (Blueprint $table) {
            $table->dropForeign(['voucher_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['order_id']);
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    }
};
