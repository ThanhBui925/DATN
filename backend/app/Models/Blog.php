<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'description', 'content', 'image', 'status'];

    protected $casts = [
        'status' => 'integer',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}