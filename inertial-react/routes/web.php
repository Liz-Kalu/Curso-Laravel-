<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SolicitudController;


Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('solicitudes.index')
        : redirect()->route('login');
});



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('solicitudes', SolicitudController::class)
        ->except(['create', 'edit'])
        ->parameters(['solicitudes' => 'solicitud']);
    Route::get('/solicitudes/{solicitud}/imprimir', [SolicitudController::class, 'imprimir'])
        ->name('solicitudes.imprimir');
    Route::get('/solicitudes-historial', [SolicitudController::class, 'historial'])
        ->name('solicitudes.historial');
    Route::post('/solicitudes/{solicitud}/tomar', [SolicitudController::class, 'tomar'])
        ->name('solicitudes.tomar');
});

require __DIR__.'/auth.php';
