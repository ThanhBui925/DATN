<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Image;
use App\Models\Category;
use App\Models\Size;
use App\Models\Color;
use App\Models\VariantProduct;
use App\Models\Review;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Product extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $table = 'products';

    protected $fillable = [
        'name',
        'category_id',
        'description',
        'price',
        'sale_price',
        'sale_end',
        'status',
        'image',
    ];

    protected $casts = [
        'status' => 'string',
        'price' => 'decimal:2',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class);
    }

    public function variants()
    {
        return $this->hasMany(VariantProduct::class);
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class)->whereNull('deleted_at');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }
    

}
