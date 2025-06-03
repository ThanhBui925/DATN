<?php

use Illuminate\Support\ServiceProvider;

return [
    'name' => env('APP_NAME', 'DATN'),
    'env' => env('APP_ENV', 'local'),
    'debug' => (bool) env('APP_DEBUG', true),
    'url' => env('APP_URL', 'http://localhost:8000'),
    'timezone' => 'Asia/Ho_Chi_Minh',
    'locale' => env('APP_LOCALE', 'vi'),
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
    'faker_locale' => env('APP_FAKER_LOCALE', 'vi_VN'),
    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY'),
    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],
    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],
    'providers' => ServiceProvider::defaultProviders()->merge([
        Laravel\Sanctum\SanctumServiceProvider::class,
        Barryvdh\DomPDF\ServiceProvider::class,
    ])->toArray(),
    'aliases' => [
        'PDF' => Barryvdh\DomPDF\Facade\Pdf::class,
    ],
];