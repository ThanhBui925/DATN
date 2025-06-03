<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreateVariantImagesTable extends Migration
{
    public function up()
    {
        Schema::create('variant_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variant_product_id');
            $table->string('image_url'); // Lưu đường dẫn hoặc tên file ảnh
            $table->timestamps();
            $table->softDeletes(); // Thêm cột deleted_at nullable
            $table->foreign('variant_product_id')->references('id')->on('variant_products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('variant_images');
    }
}
