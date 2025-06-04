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
        $tables = ['addresses', 'banners', 'blogs', 'categories', 'colors', 'customers', 'permissions', 'products',
            'reviews', 'role_has_permissions', 'roles', 'shipping', 'shop_order', 'shop_order_items',
            'shopping_cart', 'shopping_cart_item', 'sizes', 'variant_products', 'voucher_user', 'vouchers',
            'shipping_methods', 'states', 'tags', 'users'];

        foreach ($tables as $table) {
            if (Schema::hasColumn($table, 'slug')) {
                Schema::table($table, function (Blueprint $tableBlueprint) use ($table) {
                    $tableBlueprint->dropColumn('slug');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['addresses', 'banners', 'blogs', 'categories', 'colors', 'customers', 'permissions', 'products',
            'reviews', 'role_has_permissions', 'roles', 'shipping', 'shop_order', 'shop_order_items',
            'shopping_cart', 'shopping_cart_item', 'sizes', 'variant_products', 'voucher_user', 'vouchers',
            'shipping_methods', 'states', 'tags', 'users'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $tableBlueprint) {
                $tableBlueprint->string('slug')->unique()->nullable();
            });
        }
    }
};
