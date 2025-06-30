<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'shopping_cart';
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'total_price',
    ];
    protected $casts = [
        'quantity' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function items()
    {
        return $this->hasMany(ShoppingCartItem::class, 'cart_id');
    }
}
