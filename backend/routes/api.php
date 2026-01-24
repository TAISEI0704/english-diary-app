<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now()->toISOString(),
        'environment' => 'Docker + FrankenPHP + Laravel Octane',
    ]);
});
