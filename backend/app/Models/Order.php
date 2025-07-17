<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'shop_order';

    protected $fillable = [
        'date_order',
        'final_amount',
        'total_price',
        'discount_amount',
        'voucher_code',
        'order_code',
        'order_status',
        'payment_status',
        'address_id',
        'detailed_address',
        'ward_name',
        'district_name',
        'province_name',
        'payment_method',
        'user_id',
        'shipping_id',
        'shipping_fee',
        'recipient_name',
        'recipient_phone',
        'recipient_email',
    ];

    protected $casts = [
        'date_order' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'total_price' => 'decimal:2',
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

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }
}
