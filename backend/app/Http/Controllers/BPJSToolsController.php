<?php

namespace App\Http\Controllers;

use App\Http\Requests\BPJSRequest;
use App\Http\Requests\ServiceBPJSRequest;
use Illuminate\Http\Request;
use App\Models\BPJSTools;
use App\Models\SettingServiceName;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Services\BPJSToolsService;

class BPJSToolsController extends Controller
{
    protected BPJSToolsService $BPJSToolsService;
 

    public function __construct(BPJSToolsService $BPJSToolsService)
    {
        $this->BPJSToolsService = $BPJSToolsService;
    }


    public function getDokterByBPJS($id_client, Request $request)
    {   
        $service_name = 'pcare-rest';
        return $this->BPJSToolsService->getDokterBPJS($id_client, $request->all(), $service_name);

    }

    public function getPesertaByBPJS($id_client, Request $request){
        $service_name = 'pcare-rest';
        return $this->BPJSToolsService->getPesertaByBPJS($id_client, $request->all(), $service_name);
    }


    public function create(BPJSRequest $request, $id_client): JsonResponse
    {
        try {
            $bpjstools = $this->BPJSToolsService->createBPJSTool($id_client, $request->validated());
            return $this->baseResponse('BPJS Tools berhasil dibuat', null, $bpjstools, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function update(BPJSRequest $request, $id_client): JsonResponse
    {
        try {
            $bpjstools = $this->BPJSToolsService->updateBPJSTool($id_client, $request->validated());
            return $this->baseResponse('BPJS Tools berhasil diperbarui', null, $bpjstools, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }


    public function getBPJSToolsById($id_client)
    {
        
        try {
            $bpjstools = $this->BPJSToolsService->getBPJSToolsById($id_client);
            if($bpjstools == null){
                return $this->baseResponse('BPJS Tools NotFound', null, $bpjstools, 404);
            }
            return $this->baseResponse('BPJS Tools', null, $bpjstools, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }


    public function createServiceBPJS(BPJSTools $id_bpjs_tools, ServiceBPJSRequest $request)
    {
        try {
            $service_bpjs = $this->BPJSToolsService->createServiceBPJS($id_bpjs_tools, $request->validated());
            return $this->baseResponse('BPJS Service berhasil dibuat', null, $service_bpjs, 201);
            
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function updateServiceBPJSById(SettingServiceName $id_service_bpjs, ServiceBPJSRequest $request)
    {
        try {
            $service_bpjs = $this->BPJSToolsService->updateServiceBPJSById($id_service_bpjs, $request->validated());
            return $this->baseResponse('BPJS Service berhasil update', null, $service_bpjs, 201);
            
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function getPoliAntrean($id_client, Request $request)
    {
        $service_name = 'antreanfktp';
        
        try {
            $getpoliantrean = $this->BPJSToolsService->getPoliAntrean($id_client, $request->all(), $service_name);
            return $this->baseResponse('Ref Poli Antrean Berhasil Didapatkan', null, $getpoliantrean, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function getKunjunganBPJS($id_client, Request $request)
    {
        $service_name = 'pcare-rest';
        return $getriwayatkunjungan = $this->BPJSToolsService->getKunjunganBPJS($id_client, $request->all(), $service_name);
        try {
            
            return $this->baseResponse('Riwayat Kunjungan BPJS Berhasil Didapatkan', null, $getriwayatkunjungan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }
}
