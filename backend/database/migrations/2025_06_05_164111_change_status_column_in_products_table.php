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
        // Chuyển dữ liệu enum thành số
        DB::table('products')->where('status', 'active')->update(['status' => 1]);
        DB::table('products')->where('status', 'inactive')->update(['status' => 0]);

        // Sau đó mới đổi kiểu cột
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('status')->default(1)->comment('0: inactive, 1: active')->change();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive'])->default('active')->change();
        });
    }
};
