<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'product_id',
        'name',
        'quantity',
        'size_id',
        'color_id',
        'status',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

