<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToVariantProductsTable extends Migration
{
    public function up()
    {
        Schema::table('variant_products', function (Blueprint $table) {
            $table->softDeletes(); // Thêm cột deleted_at nullable
        });
    }

    public function down()
    {
        Schema::table('variant_products', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}

