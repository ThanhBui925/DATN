<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';

    protected $fillable = [
        'user_id',
        'address',
        'province_name',
        'district_name',
        'ward_name',
        'recipient_name',
        'recipient_phone',
        'recipient_email',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'address_id');
    }
    protected $casts = [
        'is_default' => 'boolean',
    ];

}