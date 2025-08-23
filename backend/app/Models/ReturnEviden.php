<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnEviden extends Model
{
    protected $table = 'return_evidences';

    protected $fillable = [
        'return_id',
        'file_type', // 'image' or 'video'
        'file_path',
    ];

    public function returnOrder()
    {
        return $this->belongsTo(ReturnOrder::class, 'return_id');
    }
}
