<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantImage extends Model
{
    use softDeletes;
    protected $table = 'variant_images';

    protected $fillable = [
        'variant_product_id',
        'image_url',
    ];

    public function variant()
    {
        return $this->belongsTo(VariantProduct::class, 'variant_product_id');
    }
}
