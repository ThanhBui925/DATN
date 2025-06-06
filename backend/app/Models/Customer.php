<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'user_id', 'phone', 'address'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}