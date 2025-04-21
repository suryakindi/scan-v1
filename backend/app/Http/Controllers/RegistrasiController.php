<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterPasienRequest;
use App\Services\BPJSToolsService;
use App\Services\RegistrasiServices;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistrasiController extends Controller
{
    protected RegistrasiServices $RegistrasiServices;
    protected BPJSToolsService $BPJSToolsService;

    public function __construct(RegistrasiServices $RegistrasiServices, BPJSToolsService $BPJSToolsService)
    {
        $this->RegistrasiServices = $RegistrasiServices;
        $this->BPJSToolsService = $BPJSToolsService;
    }


    public function saveRegistrasiPasien(RegisterPasienRequest $request)
    {
        DB::beginTransaction();
        try {
            $registrasi = $this->RegistrasiServices->saveRegistrasiPasien($request->all());
            $registrasiDetail = $this->RegistrasiServices->saveRegistrasiDetailPasien($registrasi);
            DB::commit();
            return $this->baseResponse('Registrasi Pasien berhasil dibuat', null, $registrasiDetail, 201);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->baseResponse($e->getMessage(), $e->getMessage(), null, 500);
        }
    }


    public function listRegistrasiPasien(Request $request)
    {
        try {
            $registrasi = $this->RegistrasiServices->listRegistrasiPasien($request->tglAwal, $request->tglAkhir, $request->search, $request->ruangan);
            return $this->baseResponse('Registrasi Pasien berhasil didapatkan', null, $registrasi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Registrasi Pasien', $e->getMessage(), null, 500);
        }
    }
    public function BatalRegistrasi($id_registrasi)
    {
        try {
            $registrasi = $this->RegistrasiServices->BatalRegistrasi($id_registrasi);
            return $this->baseResponse('Registrasi Pasien berhasil dibatal', null, $registrasi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Registrasi Pasien', $e->getMessage(), null, 500);
        }
    }

    public function editRegistrasiLayananPasien($id_registrasi, Request $request)
    {
        try {
            $registrasi = $this->RegistrasiServices->editRegistrasiLayananPasien($id_registrasi, $request->all());
            return $this->baseResponse('Registrasi Pasien berhasil diperbarui', null, $registrasi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Registrasi Pasien', $e->getMessage(), null, 500);
        }
    }

    public function getRegistrasiLayananPasien($id_registrasi)
    {
        try {
            $registrasi = $this->RegistrasiServices->getRegistrasiLayananPasien($id_registrasi);
            return $this->baseResponse('Registrasi Layanan Pasien berhasil didapatkan', null, $registrasi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Registrasi Pasien', $e->getMessage(), null, 500);
        }
    }

    public function saveSOAP(Request $request)
    {
        try {
            $soap = $this->RegistrasiServices->saveSOAP($request->all());
            return $this->baseResponse('Registrasi SOAP berhasil didapatkan', null, $soap, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Menyimpan SOAP', $e->getMessage(), null, 500);
        }
    }

    public function getSoapByIdRegistrasi($registrasiId)
    {
        try {
            $soaps = $this->RegistrasiServices->getSoapByIdRegistrasi($registrasiId);
            return $this->baseResponse('SOAP berhasil didapatkan', null, $soaps, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat mendapatkan SOAP', $e->getMessage(), null, 500);
        }
    }
}


