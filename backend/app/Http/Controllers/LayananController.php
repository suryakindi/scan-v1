<?php

namespace App\Http\Controllers;

use App\Models\RegistrasiPasien;
use App\Services\LayananService;
use Illuminate\Http\Request;
use Exception;

class LayananController extends Controller
{
    protected LayananService $LayananService;

    public function __construct(LayananService $LayananService)
    {
        $this->LayananService = $LayananService;
    }

    public function daftarTeregistrasi()
    {
        try {
            $daftarTeregistrasi = $this->LayananService->daftarTeregistrasi();
            return $this->baseResponse('Daftar Layanan Pasien Teregistrasi berhasil didapatkan', null, $daftarTeregistrasi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat melihat Daftar Layanan Pasien Teregistrasi', $e->getMessage(), null, 500);
        }
    }

    public function updateWaktuPemanggilan(RegistrasiPasien $id_registrasi)
    {
        
        try {
            $updateWaktuPemanggilan = $this->LayananService->updateWaktuPemanggilan($id_registrasi);
            return $this->baseResponse('Waktu pemanggilan berhasil diupdate', null, $updateWaktuPemanggilan, 200);
        } catch (Exception $e) {    
            return $this->baseResponse('Terjadi kesalahan saat memperbarui waktu pemanggilan', $e->getMessage(), null, 500);
        }
    }
}
