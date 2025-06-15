<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoucherUser extends Model
{
    protected $table = 'voucher_user';

    protected $fillable = ['voucher_id', 'user_id', 'order_id'];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
