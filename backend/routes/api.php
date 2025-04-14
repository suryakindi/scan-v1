<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaseUrlController;
use App\Http\Controllers\BPJSToolsController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\ManagementClientController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RegistrasiController;
use App\Http\Controllers\SatuSehatController;
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
    Route::post('logout-user', [AuthController::class, 'logoutUser']);
    Route::get('check-token', [AuthController::class, 'CheckToken']);

    Route::middleware('permission:Registrasi,view')->group(function () {
        Route::post('register-user', [AuthController::class, 'RegisterUser']);
        Route::get('get-user', [AuthController::class, 'getUser'])->middleware('permission:Registrasi,view');
        Route::put('update-user/{id}', [AuthController::class, 'updateUser']);
        Route::delete('delete-user/{id}', [AuthController::class, 'deleteUser']);
        Route::get('get-master-jeniskunjungan', [MasterDataController::class, 'getMasterJenisKunjungan'])->middleware('permission:Registrasi,view');
        Route::get('get-master-jaminan', [MasterDataController::class, 'getMasterjaminan'])->middleware('permission:Registrasi,view');
        Route::get('get-master-tkp', [MasterDataController::class, 'getMasterTkp'])->middleware('permission:Registrasi,view');
        Route::get('get-master-ruangan/{id_client}', [MasterDataController::class, 'getMasterruangan'])->middleware('permission:Registrasi,view');
        Route::get('get-mapping-dokter/{id_ruangan}', [MasterDataController::class, 'getMappingDokterRuangan'])->middleware('permission:Registrasi,view');

        Route::prefix('registrasi-pelayanan')->middleware('permission:Registrasi,view')->group(function () {
            Route::get('keterangan-aktif-bpjs/id_client/{id_client}', [BPJSToolsController::class, 'GetKetPesertaAktifBPJS'])->middleware('permission:Registrasi,view');
            Route::post('create-registrasi-pelayanan', [RegistrasiController::class, 'saveRegistrasiPasien'])->middleware('permission:Registrasi,create');
            Route::get('get-registrasi-pelayanan/{id_registrasi}', [RegistrasiController::class, 'getRegistrasiLayananPasien'])->middleware('permission:Registrasi,view');
            Route::post('edit-registrasi-pelayanan/{id_registrasi}', [RegistrasiController::class, 'editRegistrasiLayananPasien'])->middleware('permission:Registrasi,edit');
            Route::get('list-registrasi-pelayanan', [RegistrasiController::class, 'listRegistrasiPasien'])->middleware('permission:Registrasi,view');




            Route::put('batal-registrasi/{id_registrasi}', [RegistrasiController::class, 'BatalRegistrasi'])->middleware('permission:Registrasi,edit');
        });
    });

    Route::prefix('pasien')->middleware('permission:Registrasi,view')->group(function () {
        Route::post('register-pasien', [PasienController::class, 'createPasien'])->middleware('permission:Registrasi,create');
        Route::put('/update-ihs/{id_pasien}', [PasienController::class, 'UpdateIHSNumber'])->middleware('permission:Registrasi,edit');
        Route::get('get-pasien', [PasienController::class, 'getPasien']);
        Route::get('get-pasien-id/{id_pasien}', [PasienController::class, 'getPasienById']);
        Route::get('riwayat-pasien-id/{id_pasien}', [PasienController::class, 'riwayatPasienById']);
        Route::put('edit-pasien-id/{id_pasien}', [PasienController::class, 'editPasienById'])->middleware('permission:Registrasi,edit');
    });

    Route::prefix('layanan')->group(function () {
        Route::get('daftar-pasien/teregistrasi', [LayananController::class, 'daftarTeregistrasi']);
        Route::put('update-waktu-pemanggilan/{id_registrasi}', [LayananController::class, 'updateWaktuPemanggilan']);
    });

    Route::prefix('management')->middleware('permission:Management-Client,view')->group(function () {
        Route::post('create-client', [ManagementClientController::class, 'create'])->middleware('permission:Management-Client,create');
        Route::delete('delete-client/{client}', [ManagementClientController::class, 'delete'])->middleware('permission:Management-Client,delete');
        Route::put('update-client/{client}', [ManagementClientController::class, 'update'])->middleware('permission:Management-Client,edit');
        Route::get('get-clients', [ManagementClientController::class, 'getAll'])->middleware('permission:Management-Client,view');
        Route::get('get-client/id/{client}', [ManagementClientController::class, 'GetById'])->middleware('permission:Management-Client,view');
        Route::put('edit-master-alergi/{id_alergi}', [MasterDataController::class, 'editMasterAlergi'])->middleware('permission:Master-Data,edit');
    });

    Route::prefix('master-data')->middleware('permission:Master-Data,view')->group(function () {
        Route::post('create-master-alergi', [MasterDataController::class, 'createMasterAlergi'])->middleware('permission:Master-Data,create');
        Route::get('get-master-alergi', [MasterDataController::class, 'getMasterAlergi'])->middleware('permission:Management-Client,view');
        Route::put('edit-master-alergi/{id_alergi}', [MasterDataController::class, 'editMasterAlergi'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-alergi/{id_alergi}', [MasterDataController::class, 'deleteMasterAlergi'])->middleware('permission:Master-Data,delete');

        Route::post('create-master-jeniskunjungan', [MasterDataController::class, 'createMasterJenisKunjungan'])->middleware('permission:Master-Data,create');
        Route::put('edit-master-jeniskunjungan/{id_jeniskunjungan}', [MasterDataController::class, 'editMasterJenisKunjungan'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-jeniskunjungan/{id_jeniskunjungan}', [MasterDataController::class, 'deleteMasterJenisKunjungan'])->middleware('permission:Master-Data,delete');
        Route::get('get-master-jeniskunjungan', [MasterDataController::class, 'getMasterJenisKunjungan'])->middleware('permission:Master-Data,view');
        Route::get('get-master-diagnosa', [MasterDataController::class, 'getMasterDiagnosa'])->middleware('permission:Master-Data,view');

        Route::post('create-master-departemen', [MasterDataController::class, 'createDepartemen'])->middleware('permission:Master-Data,create');
        Route::get('get-master-departemen', [MasterDataController::class, 'getMasterDepartemen'])->middleware('permission:Management-Client,view');
        Route::put('edit-master-departemen/{id_departemen}', [MasterDataController::class, 'editMasterJenisDepartemen'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-departemen/{id_departemen}', [MasterDataController::class, 'deleteMasterDepartemen'])->middleware('permission:Master-Data,delete');

        Route::post('create-master-tkp', [MasterDataController::class, 'createTkp'])->middleware('permission:Master-Data,create');
        Route::get('get-master-tkp', [MasterDataController::class, 'getMasterTkp'])->middleware('permission:Management-Client,view');
        Route::put('edit-master-tkp/{id_tkp}', [MasterDataController::class, 'editMasterTkp'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-tkp/{id_tkp}', [MasterDataController::class, 'deleteMasterTkp'])->middleware('permission:Master-Data,delete');

        Route::post('create-master-jaminan', [MasterDataController::class, 'createjaminan'])->middleware('permission:Master-Data,create');
        Route::get('get-master-jaminan', [MasterDataController::class, 'getMasterjaminan'])->middleware('permission:Management-Client,view');
        Route::put('edit-master-jaminan/{id_jaminan}', [MasterDataController::class, 'editMasterjaminan'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-jaminan/{id_jaminan}', [MasterDataController::class, 'deleteMasterjaminan'])->middleware('permission:Master-Data,delete');

        Route::post('create-master-ruangan/', [MasterDataController::class, 'createMasterRuangan'])->middleware('permission:Master-Data,create');
        Route::get('get-master-ruangan/{id_client}', [MasterDataController::class, 'getMasterruangan'])->middleware('permission:Master-Data,view');
        Route::put('edit-master-ruangan/{id_ruangan}', [MasterDataController::class, 'editMasterRuangan'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-master-ruangan/{id_ruangan}', [MasterDataController::class, 'deleteMasterRuangan'])->middleware('permission:Master-Data,delete');

        Route::post('mapping-dokter-ruangan', [MasterDataController::class, 'mappingDokterRuangan'])->middleware('permission:Master-Data,create');
        Route::get('get-mapping-dokter/{id_ruangan}', [MasterDataController::class, 'getMappingDokterRuangan'])->middleware('permission:Master-Data,view');
        Route::put('edit-mapping-dokter-ruangan/{id_mapping}', [MasterDataController::class, 'editMappingDokterRuangan'])->middleware('permission:Master-Data,edit');
        Route::delete('delete-mapping-dokter-ruangan/{id_mapping}', [MasterDataController::class, 'deleteMappingDokterRuangan'])->middleware('permission:Master-Data,delete');

    });

    Route::prefix('integerasi-sistem')->middleware('permission:Management-Client,view')->group(function () {
        Route::post('create-base-url', [BaseUrlController::class, 'create'])->middleware('permission:Management-Client,create');
        Route::get('get-base-url', [BaseUrlController::class, 'getBaseUrl'])->middleware('permission:Management-Client,view');
        Route::put('edit-base-url/{id_baseurl}', [BaseUrlController::class, 'update'])->middleware('permission:Management-Client,edit');
        Route::post('create-bpjs-tools/{id_client}', [BPJSToolsController::class, 'create'])->middleware('permission:Management-Client,create');
        Route::post('create-service-bpjs/{id_bpjs_tools}', [BPJSToolsController::class, 'createServiceBPJS'])->middleware('permission:Management-Client,create');
        Route::get('get-bpjs-tools/{id_client}', [BPJSToolsController::class, 'getBPJSToolsById'])->middleware('permission:Management-Client,view');
        Route::put('update-bpjs-tools/{id_client}', [BPJSToolsController::class, 'update'])->middleware('permission:Management-Client,edit');
        Route::put('update-service-bpjs/{id_service_bpjs}', [BPJSToolsController::class, 'updateServiceBPJSById'])->middleware('permission:Management-Client,edit');
        Route::get('get-dokter-bpjs/id_client/{id_client}', [BPJSToolsController::class, 'getDokterByBPJS'])->middleware('permission:Management-Client,view');
        Route::get('get-peserta-bpjs/id_client/{id_client}', [BPJSToolsController::class, 'getPesertaByBPJS'])->middleware('permission:Management-Client,view');
        Route::get('/kunjungan/riwayat-bpjs/{id_client}', [BPJSToolsController::class, 'getKunjunganBPJS'])->middleware('permission:Management-Client,view');
        Route::get('/antrean/get-poli/{id_client}', [BPJSToolsController::class, 'getPoliAntrean'])->middleware('permission:Management-Client,view');
        Route::get('get-poli/{id_client}', [BPJSToolsController::class, 'getPoliReferensi'])->middleware('permission:Management-Client,view');
        Route::post('sinkronisasi-poli/{id_client}', [BPJSToolsController::class, 'sinkronisasiPoli'])->middleware('permission:Management-Client,create');


        Route::post('create-satu-sehat', [SatuSehatController::class, 'createSatuSehat'])->middleware('permission:Management-Client,create');
        Route::put('edit-satu-sehat/{id_satusehat}', [SatuSehatController::class, 'editSatuSehat'])->middleware('permission:Management-Client,edit');
        Route::delete('delete-satu-sehat/{id_satusehat}', [SatuSehatController::class, 'deleteSatuSehat'])->middleware('permission:Management-Client,delete');
        Route::get('/ihs/patients/{nik}', [SatuSehatController::class, 'getIhsPatientByNik'])->middleware('permission:Management-Client,view');
        Route::get('check-satu-sehat', [SatuSehatController::class, 'getTokenAccess'])->middleware('permission:Management-Client,view');
        Route::get('check-kfav2', [SatuSehatController::class, 'GetKFAv2'])->middleware('permission:Management-Client,view');
        Route::get('get-satu-sehat/{id_client}', [SatuSehatController::class, 'getSatuSehat'])->middleware('permission:Management-Client,view');


        Route::get('get-role', [PermissionController::class, 'getRole'])->middleware('permission:Management-Client,view');
        Route::get('get-modul', [PermissionController::class, 'getModul'])->middleware('permission:Management-Client,view');
        Route::get('get-role-permission/{role_id}', [PermissionController::class, 'getPermission'])->middleware('permission:Management-Client,view');
        Route::get('get-user-permission/{user_id}', [PermissionController::class, 'getUserPermission'])->middleware('permission:Management-Client,view');
        Route::delete('delete-role-permission/{id_permission}', [PermissionController::class, 'deletePermission'])->middleware('permission:Management-Client,delete');
        Route::delete('delete-user-permission/{id_user_permission}', [PermissionController::class, 'deleteUserPermission'])->middleware('permission:Management-Client,delete');
        Route::post('create-permission/role', [PermissionController::class, 'createPermissionRole'])->middleware('permission:Management-Client,create');
        Route::post('create-user-permission/user', [PermissionController::class, 'createPermissionUser'])->middleware('permission:Management-Client,create');
        Route::put('update-user-permission/{id_user_permission}', [PermissionController::class, 'UpdateUserPermissionRole'])->middleware('permission:Management-Client,edit');
        Route::put('update-permission/permission/{id_permission}', [PermissionController::class, 'UpdatePermissionRole'])->middleware('permission:Management-Client,edit');
    });






});

// Route Viewer

Route::get('/viewer/get-clients', [ManagementClientController::class, 'getAll']);
Route::get('/viewer/get-master-ruangan/{id_client}', [MasterDataController::class, 'getMasterruangan']);
Route::get('/viewer/get-mapping-dokter/{id_ruangan}', [MasterDataController::class, 'getMappingDokterRuangan']);
Route::get('/viewer/get-mapping-dokter-array', [MasterDataController::class, 'getMappingDokterRuanganArray']);
Route::get('/viewer/get-antrian/{cdfix}/{id_ruangan}', [MasterDataController::class, 'getAntrianViewer']);
