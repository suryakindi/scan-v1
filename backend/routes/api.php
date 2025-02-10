<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->group(function () {
    Route::get('/', function () {
        return response()->json([
            'message' => 'Unauthorized',
        ], 401);
    })->name('login');
   
    
    Route::post('login-user', [AuthController::class, 'LoginUser']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('check-token', [AuthController::class, 'CheckToken']);
    Route::middleware('permission:Registrasi,create')->group(function () {
            Route::post('register-user', [AuthController::class, 'RegisterUser']);
    });
   
    // Modul Registrasi

    // Route::middleware('permission:Registrasi,view')->group(function () {
    //     Route::get('/registrasi', [RegistrasiController::class, 'index']);
    // });

    

});
