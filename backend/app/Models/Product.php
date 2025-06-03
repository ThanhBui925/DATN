<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['slug', 'category_id', 'name', 'description', 'price', 'sale_price', 'sale_end', 'status'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}