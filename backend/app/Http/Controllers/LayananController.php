<?php

namespace App\Http\Controllers;

use App\Models\RegistrasiPasien;
use App\Models\VitalSign;
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

    public function daftarTeregistrasi(Request $request)
    {
        try {
            $daftarTeregistrasi = $this->LayananService->daftarTeregistrasi($request->tglAwal, $request->tglAkhir, $request->search, $request->ruangan);
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

    public function getUser($cdfix)
    {
        try {
            $user = $this->LayananService->getUser($cdfix);
            return $this->baseResponse('User berhasil Didapatkan', null, $user, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat get user', $e->getMessage(), null, 500);
        }
    }

    public function daftarTeregistrasiById($id_registrasi)
    {
        try {
            $daftarTeregistrasi = $this->LayananService->daftarTeregistrasiById($id_registrasi);
            return $this->baseResponse('Daftar Layanan Pasien Teregistrasi berhasil didapatkan', null, $daftarTeregistrasi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat melihat Daftar Layanan Pasien Teregistrasi', $e->getMessage(), null, 500);
        }
    }

    public function saveVitalSign(Request $request)
    {
        try {
            $vitalSign = $this->LayananService->saveVitalSign($request->all());
            return $this->baseResponse('Vital Sign berhasil Disimpan', null, $vitalSign, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Menyimpan Vital Sign', $e->getMessage(), null, 500);
        }
    }

    public function getVitalSignById(VitalSign $id_vital_sign)
    {
        try {
            $vitalSign = $this->LayananService->getVitalSignById($id_vital_sign);
            return $this->baseResponse('Vital Sign berhasil didapatkan', null, $vitalSign, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat mendapatkan Vital Sign', $e->getMessage(), null, 500);
        }
    }
}
