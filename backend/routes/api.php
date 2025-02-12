<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaseUrlController;
use App\Http\Controllers\BPJSToolsController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\ManagementClientController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PermissionController;
use App\Models\BPJSTools;
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

Route::prefix('lokasi')->group(function () {
    Route::get('provinces', [LokasiController::class, 'provinces']);
    Route::get('regencies', [LokasiController::class, 'regencies']);
    Route::get('districts', [LokasiController::class, 'districts']);
    Route::get('villages', [LokasiController::class, 'villages']);
});

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
            Route::get('get-user', [AuthController::class, 'getUser'])->middleware('permission:Registrasi,view');
            Route::put('update-user/{id}', [AuthController::class, 'updateUser']);
            Route::delete('delete-user/{id}', [AuthController::class, 'deleteUser']);
    });

    Route::prefix('management')->middleware('permission:Management-Client,view')->group(function () {
        Route::post('create-client', [ManagementClientController::class, 'create'])->middleware('permission:Management-Client,create');
        Route::delete('delete-client/{client}', [ManagementClientController::class, 'delete'])->middleware('permission:Management-Client,delete');
        Route::put('update-client/{client}', [ManagementClientController::class, 'update'])->middleware('permission:Management-Client,edit');
        Route::get('get-clients', [ManagementClientController::class, 'getAll'])->middleware('permission:Management-Client,view');
        Route::get('get-client/id/{client}', [ManagementClientController::class, 'GetById'])->middleware('permission:Management-Client,view');
    });

    Route::prefix('master-data')->middleware('permission:Master-Data,view')->group(function () {
        Route::post('create-master-alergi', [MasterDataController::class, 'createMasterAlergi'])->middleware('permission:Master-Data,create');
        Route::get('get-master-alergi', [MasterDataController::class, 'getMasterAlergi'])->middleware('permission:Management-Client,view');
        Route::put('edit-master-alergi/{id_alergi}', [MasterDataController::class, 'editMasterAlergi'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-alergi/{id_alergi}', [MasterDataController::class, 'deleteMasterAlergi'])->middleware('permission:Master-Data,delete');
        Route::post('create-master-jeniskunjungan', [MasterDataController::class, 'createMasterJenisKunjungan'])->middleware('permission:Master-Data,create');
        Route::put('edit-master-jeniskunjungan/{id_jeniskunjungan}', [MasterDataController::class, 'editMasterJenisKunjungan'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-jeniskunjungan/{id_jeniskunjungan}', [MasterDataController::class, 'deleteMasterJenisKunjungan'])->middleware('permission:Master-Data,delete');
        Route::get('get-master-jeniskunjungan', [MasterDataController::class, 'getMasterJenisKunjungan'])->middleware('permission:Management-Client,view');
    });
    
    Route::prefix('integerasi-sistem')->middleware('permission:Integrasi-Tools,view')->group(function () {
       Route::post('create-base-url',[BaseUrlController::class, 'create'])->middleware('permission:Integrasi-Tools,create');
       Route::put('edit-base-url/{id_baseurl}',[BaseUrlController::class, 'update'])->middleware('permission:Integrasi-Tools,edit');
       Route::post('create-bpjs-tools/{id_client}', [BPJSToolsController::class, 'create'])->middleware('permission:Integrasi-Tools,create');
       Route::get('get-bpjs-tools/{id_client}', [BPJSToolsController::class, 'getBPJSToolsById'])->middleware('permission:Integrasi-Tools,view');
       Route::put('update-bpjs-tools/{id_client}', [BPJSToolsController::class, 'update'])->middleware('permission:Integrasi-Tools,edit');
       Route::get('get-dokter-bpjs/id_client/{id_client}', [BPJSToolsController::class, 'getDokterByBPJS'])->middleware('permission:Integrasi-Tools,view');
       Route::get('get-peserta-bpjs/id_client/{id_client}', [BPJSToolsController::class, 'getPesertaByBPJS'])->middleware('permission:Integrasi-Tools,view');



       Route::get('get-role', [PermissionController::class, 'getRole'])->middleware('permission:Integrasi-Tools,view');
       Route::get('get-modul', [PermissionController::class, 'getModul'])->middleware('permission:Integrasi-Tools,view');
       Route::get('get-role-permission/{role_id}', [PermissionController::class, 'getPermission'])->middleware('permission:Integrasi-Tools,view');
       Route::get('get-user-permission/{user_id}', [PermissionController::class, 'getUserPermission'])->middleware('permission:Integrasi-Tools,view');
       Route::delete('delete-role-permission/{id_permission}', [PermissionController::class, 'deletePermission'])->middleware('permission:Integrasi-Tools,delete');
       Route::delete('delete-user-permission/{id_user_permission}', [PermissionController::class, 'deleteUserPermission'])->middleware('permission:Integrasi-Tools,delete');
       Route::post('create-permission/role', [PermissionController::class, 'createPermissionRole'])->middleware('permission:Integrasi-Tools,create');
       Route::post('create-user-permission/user', [PermissionController::class, 'createPermissionUser'])->middleware('permission:Integrasi-Tools,create');
       Route::put('update-user-permission/{id_user_permission}', [PermissionController::class, 'UpdateUserPermissionRole'])->middleware('permission:Integrasi-Tools,edit');   
       Route::put('update-permission/permission/{id_permission}', [PermissionController::class, 'UpdatePermissionRole'])->middleware('permission:Integrasi-Tools,edit');   
    });


    

    

});
