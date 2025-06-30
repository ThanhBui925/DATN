<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\VariantProduct;

class ShoppingCartItem extends Model
{
    
    protected $table = 'shopping_cart_item';
    protected $fillable = [
        'cart_id',
        'product_id',
        'variant_id',
        'quantity',
        'price',
    ];
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(VariantProduct::class, 'variant_id');
    }
}
