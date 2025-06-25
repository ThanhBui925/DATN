<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use SoftDeletes;

    protected $table = 'vouchers';

    protected $fillable = [
        'code',
        'discount_type',
        'discount',
        'max_discount_amount',
        'min_order_amount',
        'usage_limit',
        'usage_limit_per_user',
        'usage_count',
        'is_public',
        'user_id',
        'start_date',
        'expiry_date',
        'status',
        'applies_to',
    ];

    protected $casts = [
        'discount' => 'float',
        'max_discount_amount' => 'float',
        'min_order_amount' => 'float',
        'usage_limit' => 'integer',
        'usage_limit_per_user' => 'integer',
        'usage_count' => 'integer',
        'is_public' => 'boolean',
        'start_date' => 'datetime',
        'expiry_date' => 'datetime',
        'status' => 'boolean',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Nhiều sản phẩm có thể sử dụng voucher này
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_voucher')->withTimestamps();
    }

    // Nhiều danh mục có thể sử dụng voucher này
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_voucher')->withTimestamps();
    }
}
