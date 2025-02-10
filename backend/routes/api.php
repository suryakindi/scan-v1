<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManagementClientController;
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

    Route::prefix('management')->middleware('permission:Management-Client')->group(function () {
        Route::post('create-client', [ManagementClientController::class, 'create'])->middleware('permission:Management-Client,create');
        Route::delete('delete-client/{client}', [ManagementClientController::class, 'delete'])->middleware('permission:Management-Client,delete');
        Route::put('update-client/{client}', [ManagementClientController::class, 'update'])->middleware('permission:Management-Client,edit');
        Route::get('get-clients', [ManagementClientController::class, 'getAll'])->middleware('permission:Management-Client,view');
        Route::get('get-client/{client}', [ManagementClientController::class, 'GetById'])->middleware('permission:Management-Client,view');
    });
    

    

    

});
