<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeStatusToTinyintInUsersTable extends Migration
{
    public function up()
    {
        // Đổi giá trị cũ 'active'/'inactive' thành 1/0 trước (nếu cần)
        DB::table('users')->where('status', 'active')->update(['status' => 1]);
        DB::table('users')->where('status', 'inactive')->update(['status' => 0]);

        Schema::table('users', function (Blueprint $table) {
            $table->tinyInteger('status')->default(1)->change(); // 1 = active, 0 = inactive
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });

        // Khôi phục giá trị text nếu rollback
        DB::table('users')->where('status', 1)->update(['status' => 'active']);
        DB::table('users')->where('status', 0)->update(['status' => 'inactive']);
    }
}
