<?php

use App\Http\Controllers\Diary\ShowController as DiaryShowController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now()->toISOString(),
        'environment' => 'Docker + FrankenPHP + Laravel Octane',
    ]);
});

Route::prefix('diary')->group(function () {
    Route::get('/show', DiaryShowController::class)->name('diary.show');
});
