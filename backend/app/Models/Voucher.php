<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug', 'code', 'discount', 'discount_type', 'expiry_date', 'status',
        'description', 'usage_limit', 'usage_count', 'product_id', 'category_id'
    ];

    protected $casts = [
        'expiry_date' => 'datetime',
        'discount' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'voucher_user', 'voucher_id', 'user_id')
                    ->withPivot('order_id')
                    ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
