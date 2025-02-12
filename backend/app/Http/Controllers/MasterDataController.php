<?php

namespace App\Http\Controllers;

use App\Models\MasterAlergi;
use Illuminate\Http\Request;
use App\Services\MasterDataService;
use App\Models\MasterJenisKunjungan;
use Exception;
class MasterDataController extends Controller
{
    protected MasterDataService $MasterDataService;

    public function __construct(MasterDataService $MasterDataService)
    {
        $this->MasterDataService = $MasterDataService;
    }

    public function createMasterAlergi(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nama_alergi' => 'required|string',
                'kode_bpjs'=>'nullable'
            ]);
            $MasterDataService = $this->MasterDataService->createMasterAlergi($validatedData);
            return $this->baseResponse('Master Alergi berhasil dibuat', null, $MasterDataService, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master Alergi', $e->getMessage(), null, 500);
        }
    }

    public function getMasterAlergi()
    {
        try {
            $masterAlergi = $this->MasterDataService->getMasterAlergi();
            return $this->baseResponse('Master Alergi berhasil Didapatkan', null, $masterAlergi, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function editMasterAlergi(MasterAlergi $id_alergi, Request $request)
    {
        try {
            $updateAlergi = $this->MasterDataService->updateMasterAlergi($id_alergi, $request->all());
            return $this->baseResponse('updateAlergi berhasil diperbarui', null, $updateAlergi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui updateAlergi', $e->getMessage(), null, 500);
        }
    }

    public function deleteMasterAlergi(MasterAlergi $id_alergi)
    {
        try {
            $alergi = $this->MasterDataService->deleteAlergi($id_alergi);
            return $this->baseResponse('Delete berhasil', null, $alergi, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui', $e->getMessage(), null, 500);
        }
    }

    public function createMasterJenisKunjungan(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'jenis_kunjungan' => 'required|string',
                'kode_bpjs'=>'nullable'
            ]);
            $MasterDataService = $this->MasterDataService->createMasterJenisKunjungan($validatedData);
            return $this->baseResponse('Master jenis_kunjungan berhasil dibuat', null, $MasterDataService, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master jenis_kunjungan', $e->getMessage(), null, 500);
        }
    }

    public function editMasterJenisKunjungan(MasterJenisKunjungan $id_jeniskunjungan,Request $request)
    {
        try {
            $updateAlergi = $this->MasterDataService->updateMasterJenisKunjungan($id_jeniskunjungan, $request->all());
            return $this->baseResponse('updateMasterJenisKunjungan berhasil diperbarui', null, $updateAlergi, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui updateMasterJenisKunjungan', $e->getMessage(), null, 500);
        }
    }

    public function deleteMasterJenisKunjungan(MasterJenisKunjungan $id_jeniskunjungan)
    {
        try {
            $jeniskunjungan = $this->MasterDataService->deleteMasterJenisKunjungan($id_jeniskunjungan);
            return $this->baseResponse('Delete berhasil', null, $jeniskunjungan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui', $e->getMessage(), null, 500);
        }
    }

}
