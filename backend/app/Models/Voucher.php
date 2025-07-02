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
    ];

    protected $casts = [
        'discount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_limit_per_user' => 'integer',
        'usage_count' => 'integer',
//         'is_public' => 'boolean',
//         'status' => 'boolean',
        'start_date' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
