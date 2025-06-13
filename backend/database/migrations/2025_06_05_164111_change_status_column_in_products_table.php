<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Chạy migration.
     */
    public function up()
    {
        // Bước 1: Chuyển cột status thành kiểu string tạm thời để tránh ràng buộc enum
        Schema::table('products', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });

        // Bước 2: Cập nhật dữ liệu (vẫn là string)
        DB::table('products')->where('status', 'active')->update(['status' => '1']);
        DB::table('products')->where('status', 'inactive')->update(['status' => '0']);

        // Bước 3: Chuyển cột status thành tinyInteger
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('status')->default(1)->comment('0: inactive, 1: active')->change();
        });
    }

    /**
     * Hoàn tác migration.
     */
    public function down()
    {
        // Bước 1: Chuyển cột status thành kiểu string tạm thời
        Schema::table('products', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });

        // Bước 2: Khôi phục dữ liệu về 'active' và 'inactive'
        DB::table('products')->where('status', '1')->update(['status' => 'active']);
        DB::table('products')->where('status', '0')->update(['status' => 'inactive']);

        // Bước 3: Chuyển cột status về kiểu enum
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive'])->default('active')->change();
        });
    }
};
