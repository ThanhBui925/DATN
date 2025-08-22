<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnOrder extends Model
{
    protected $table = 'returns';

    protected $fillable = [
        'order_id',
        'user_id',
        'reason',
        'reason_for_refusal',
        'transaction_code',
        'refund_bank',
        'refund_account_name',
        'refund_account_number',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function evidences()
    {
        return $this->hasMany(ReturnEviden::class, 'return_id');
    }
}

