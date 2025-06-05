<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $fillable = [
        'user_id',
        'status',
        'total_amount',
        'shipping_address',
        'billing_address',
    ];
    protected $casts = [
        'status' => 'string',
        'total_amount' => 'decimal:2',
    ];
    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')
                    ->withPivot('quantity', 'price');
    }
}
