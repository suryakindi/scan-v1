<?php

namespace App\Http\Controllers;

use App\Models\MasterAlergi;
use App\Models\MasterDepartemen;
use Illuminate\Http\Request;
use App\Services\MasterDataService;
use App\Models\MasterJenisKunjungan;
use App\Models\MasterRuangan;
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

    public function getMasterJenisKunjungan()
    {
        try {
            $jeniskunjungan = $this->MasterDataService->getMasterJenisKunjungan();
            return $this->baseResponse('Master jeniskunjungan berhasil Didapatkan', null, $jeniskunjungan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function getMasterDiagnosa(Request $request)
    {
        $SearchQuery = $request->input('search', null); // Lebih ringkas

        try {
            $diagnosa = $this->MasterDataService->getMasterDiagnosa($SearchQuery);
            return $this->baseResponse('Master Diagnosa berhasil didapatkan', null, $diagnosa, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function createDepartemen(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nama_departemen' => 'required|string',
                'cdfix'=>'required',
                'is_active'=>'nullable',
            ]);
            $MasterDataService = $this->MasterDataService->createDepartemen($validatedData);
            return $this->baseResponse('Master Departemen berhasil dibuat', null, $MasterDataService, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master Alergi', $e->getMessage(), null, 500);
        }
    }

    public function getMasterDepartemen()
    {
        try {
            $masterdepartemen = $this->MasterDataService->getMasterDepartemen();
            return $this->baseResponse('Master Departemen berhasil didapatkan', null, $masterdepartemen, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master departemen', $e->getMessage(), null, 500);
        }
    }
    
    public function editMasterJenisDepartemen(MasterDepartemen $id_departemen, Request $request)
    {
        try {
            $masterdepartemen = $this->MasterDataService->editMasterJenisDepartemen($id_departemen, $request->all());
            return $this->baseResponse('Master Departemen berhasil update', null, $masterdepartemen, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master departemen', $e->getMessage(), null, 500);
        }
    }

    public function deleteMasterDepartemen(MasterDepartemen $id_departemen)
    {
        try {
            $Departemen = $this->MasterDataService->deleteMasterDepartemen($id_departemen);
            return $this->baseResponse('Delete berhasil', null, $Departemen, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui', $e->getMessage(), null, 500);
        }
    }

    public function createMasterRuangan(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nama_ruangan' => 'required|string',
                'id_departemen'=>'required',
                'cdfix'=>'required',
                'is_active'=>'nullable',
            ]);
            $MasterDataService = $this->MasterDataService->createMasterRuangan($validatedData);
            return $this->baseResponse('Master Ruangan berhasil dibuat', null, $MasterDataService, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master Alergi', $e->getMessage(), null, 500);
        }
    }

    public function editMasterRuangan(MasterRuangan $id_ruangan, Request $request)
    {
      
        try {
            $masterRuangan = $this->MasterDataService->editMasterRuangan($id_ruangan, $request->all());
            return $this->baseResponse('Master Ruangan berhasil update', null, $masterRuangan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master departemen', $e->getMessage(), null, 500);
        }
    }

    public function deleteMasterRuangan(MasterRuangan $id_ruangan)
    {
        try {
            $Ruangan = $this->MasterDataService->deleteMasterRuangan($id_ruangan);
            return $this->baseResponse('Delete berhasil', null, $Ruangan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui', $e->getMessage(), null, 500);
        }
    }

    public function getMasterRuangan()
    {
        try {
            $masterRuangan = $this->MasterDataService->getMasterRuangan();
            return $this->baseResponse('Master Ruangan berhasil didapatkan', null, $masterRuangan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master ruangan', $e->getMessage(), null, 500);
        }
    }
}
