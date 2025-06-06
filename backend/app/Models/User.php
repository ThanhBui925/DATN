<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'status', // Thêm 'status' nếu bạn cho phép gán hàng loạt
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Laravel 9+ tự động hash mật khẩu khi gán
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }

    public function isAdmin(): bool
    {
        return $this->roles()->whereIn('slug', ['admin', 'administrator'])->exists();
    }

    public function hasRole(string $roleSlug): bool
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }
}