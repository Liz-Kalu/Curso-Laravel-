<?php

use App\Http\Controllers\ControladorPost;
use Illuminate\Support\Facades\Route;

// Página principal
Route::view('/', 'welcome')->name('home');

Route::view('contacto', 'contact')->name('contacto');

// Blog
Route::get('blog', [ControladorPost::class, 'index'])->name('posts.index');
Route::get('blog/create', [ControladorPost::class, 'create'])->name('posts.create');
Route::post('blog', [ControladorPost::class, 'store'])->name('posts.store');
Route::get('blog/{post}', [ControladorPost::class, 'show'])->name('posts.show');
Route::get('blog/{post}/edit', [ControladorPost::class, 'edit'])->name('posts.edit');
Route::patch('blog/{post}', [ControladorPost::class, 'update'])->name('posts.update');
Route::delete('blog/{post}', [ControladorPost::class, 'destroy'])->name('posts.destroy');

// Nosotros
Route::view('nosotros', 'about')->name('nosotros');

// Dashboard sin autenticación
Route::view('dashboard', 'dashboard')->name('dashboard');

// Si settings.php tiene rutas que sí quieres conservar
require __DIR__.'/settings.php';
