<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'phone', 'address', 'avatar', 'dob', 'gender'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}