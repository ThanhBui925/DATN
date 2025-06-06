<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'shop_order_items';

    protected $fillable = [
        'slug',
        'order_id',
        'product_id',
        'quantity',
        'price',
        'variant_id',
    ];


    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    public function variant()
    {
        return $this->belongsTo(VariantProduct::class);
    }   
}

