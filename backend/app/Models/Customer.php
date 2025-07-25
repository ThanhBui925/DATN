<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'phone', 'address_id', 'avatar', 'dob', 'gender'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'user_id');
    }

}