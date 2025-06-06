<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'shop_order';

    protected $fillable = [
        'slug', 'date_order', 'total_price', 'order_status', 'cancel_reason',
        'payment_status', 'shipping_address', 'payment_method', 'shipped_at',
        'delivered_at', 'user_id', 'customer_id', 'shipping_id',
        'recipient_name', 'recipient_phone'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function shipping()
    {
        return $this->belongsTo(Shipping::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}