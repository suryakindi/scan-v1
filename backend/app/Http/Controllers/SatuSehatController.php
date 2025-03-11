<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SatuSehatRequest;
use App\Models\SatuSehatTools;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use App\Services\SatuSehatService;
class SatuSehatController extends Controller
{
    protected SatuSehatService $SatuSehatService;

    public function __construct(SatuSehatService $SatuSehatService)
    {
        $this->SatuSehatService = $SatuSehatService;
    }


    public function createSatuSehat(SatuSehatRequest $request)
    {
        try {
            $satusehat = $this->SatuSehatService->createSatuSehat($request->validated());
            return $this->baseResponse('satusehat berhasil ditambahkan', null, $satusehat, 201);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Membuat Satu Sehat Tools', $e->getMessage(), null, 500);
        }
    }
    

    public function deleteSatuSehat(SatuSehatTools $id_satusehat)
    {
        try {
            $satusehat = $this->SatuSehatService->deleteSatuSehat($id_satusehat);
            return $this->baseResponse('satusehat berhasil delete', null, $satusehat, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Delete Satu Sehat Tools', $e->getMessage(), null, 500);
        }
    }

    public function editSatuSehat(SatuSehatTools $id_satusehat, SatuSehatRequest $request)
    {
        try {
            $satusehat = $this->SatuSehatService->editSatuSehat($id_satusehat, $request->validated());
            return $this->baseResponse('satusehat berhasil dibuat', null, $satusehat, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat update Satu Sehat Tools', $e->getMessage(), null, 500);
        }
    }

    public function getTokenAccess()
    {
        $cdfix = Auth()->user()->cdfix;
        
        $credentials = $this->SatuSehatService->getSatuSehatCredentials($cdfix);
        // return $credentials;
        try {
            $Accesstoken = $this->SatuSehatService->getTokenAccess($credentials);
            return $this->baseResponse('satusehat Token berhasil', null, $Accesstoken, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
        
        
    }

    public function getIhsPatientByNik($nik)
    {
        $cdfix = Auth()->user()->cdfix;
        
        $credentials = $this->SatuSehatService->getSatuSehatCredentials($cdfix);
        try {
            $Accesstoken = $this->SatuSehatService->getTokenAccess($credentials);
            $Result = $this->SatuSehatService->getIhsPatientByNik($Accesstoken, $nik);
            
            return $this->baseResponse('satusehat berhasil', null, $Result, 200);

        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }


    public function GetKFAv2(Request $request) {
        $cdfix = Auth()->user()->cdfix;
        $credentials = $this->SatuSehatService->getSatuSehatCredentials($cdfix);
        try {
            $Accesstoken = $this->SatuSehatService->getTokenAccess($credentials);
            $satusehat = $this->SatuSehatService->GetKFAv2($Accesstoken, $request->all());
            return $this->baseResponse('satusehat berhasil', null, $satusehat, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function getSatuSehat($id_client)
    {
        try {
            $satusehat = $this->SatuSehatService->getSatuSehat($id_client);
            return $this->baseResponse('satusehat berhasil Didapatkan', null, $satusehat, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }
}
