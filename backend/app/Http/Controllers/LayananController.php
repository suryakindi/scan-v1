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
            $daftarTeregistrasi = $this->LayananService->daftarTeregistrasi($request->tglAwal, $request->tglAkhir, $request->search, $request->ruangan, $request->all());
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

    public function saveSOAP(Request $request)
    {
        try {
            $soap = $this->LayananService->saveSOAP($request->all());
            return $this->baseResponse('Registrasi SOAP berhasil disimpan', null, $soap, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Menyimpan SOAP', $e->getMessage(), null, 500);
        }
    }

    public function getSoapByIdRegistrasi($registrasiId)
    {
        try {
            $soaps = $this->LayananService->getSoapByIdRegistrasi($registrasiId);
            return $this->baseResponse('SOAP berhasil didapatkan', null, $soaps, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat mendapatkan SOAP', $e->getMessage(), null, 500);
        }
    }

    public function getKesadaran()
    {
        try {
            $kesadaran = $this->LayananService->getKesadaran();
            return $this->baseResponse('Kesadaran berhasil didapatkan', null, $kesadaran, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat mendapatkan Kesadaran', $e->getMessage(), null, 500);
        }
    }

    public function saveGambarMRecord(Request $request)
    {
        try {
            $gambar = $this->LayananService->saveGambarMRecord($request->all());

            return $this->baseResponse('Gambar berhasil disimpan', null, $gambar, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi error saat menyimpan gambar', $e->getMessage(), null, 500);
        }
    }

    public function getGambarMRecord($registrasiId)
    {
        try {
            $gambar = $this->LayananService->getGambarMRecord($registrasiId);

            return $this->baseResponse('Gambar berhasil didapatkan', null, $gambar, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi error saat mendapatkan gambar', $e->getMessage(), null, 500);
        }
    }
}
