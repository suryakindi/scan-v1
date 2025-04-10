<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterPasienRequest;
use App\Services\RegistrasiServices;
use Exception;
use Illuminate\Http\Request;

class RegistrasiController extends Controller
{
    protected RegistrasiServices $RegistrasiServices;

    public function __construct(RegistrasiServices $RegistrasiServices)
    {
        $this->RegistrasiServices = $RegistrasiServices;
    }

    public function saveRegistrasiPasien(RegisterPasienRequest $request)
    {
        try {
            $registrasi = $this->RegistrasiServices->saveRegistrasiPasien($request->all());    
            $registrasiDetail = $this->RegistrasiServices->saveRegistrasiDetailPasien($registrasi);
            return $this->baseResponse('Registrasi Pasien berhasil dibuat', null, $registrasi, 201);
        } catch (Exception $e) {
            return $this->baseResponse($e->getMessage(), $e->getMessage(), null, 500);
        }
    }  
    
    
public function listRegistrasiPasien(Request $request)
    {
        try {
            $registrasi = $this->RegistrasiServices->listRegistrasiPasien($request->tglAwal, $request->tglAkhir, $request->search);
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
}


