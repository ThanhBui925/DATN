<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantProduct extends Model
{
    use HasFactory, softDeletes;
    protected $table = 'variant_products';
    protected $fillable = [
        'product_id',
        'name',
        'quantity',
        'size_id',
        'color_id',
        'status',
    ];

    public function size()
    {
        return $this->belongsTo(\App\Models\Size::class);
    }

    public function color()
    {
        return $this->belongsTo(\App\Models\Color::class);
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\Product::class);
    }

    public function images()
    {
        return $this->hasMany(VariantImage::class, 'variant_product_id');
    }

}