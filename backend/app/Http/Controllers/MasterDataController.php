<?php

namespace App\Http\Controllers;

use App\Models\MasterAlergi;
use App\Models\MasterDepartemen;
use App\Models\MasterJaminan;
use Illuminate\Http\Request;
use App\Services\MasterDataService;
use App\Models\MasterTkp;
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
                'kodeexternal'=>'nullable',
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

    public function getMasterRuangan($id_client)
    {
        try {
            $masterRuangan = $this->MasterDataService->getMasterRuangan($id_client);
            return $this->baseResponse('Master Ruangan berhasil didapatkan', null, $masterRuangan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master ruangan', $e->getMessage(), null, 500);
        }
    }

    public function createTkp(Request $request)
    {
       
        try {
            $validatedData = $request->validate([
                'nama_tkp' => 'required|string',
                'kodeexternal'=>'nullable',
                'cdfix'=>'required',
                'is_active'=>'nullable',
            ]);
            $MasterDataService = $this->MasterDataService->createTkp($validatedData);
            return $this->baseResponse('Master tkp berhasil dibuat', null, $MasterDataService, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat tkp', $e->getMessage(), null, 500);
        }
    }

    public function getMasterTkp()
    {
        try {
            $tkp = $this->MasterDataService->getMasterTkp();
            return $this->baseResponse('Master Tkp berhasil didapatkan', null, $tkp, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master Tkp', $e->getMessage(), null, 500);
        }
    }

    public function editMasterTkp(MasterTkp $id_tkp, Request $request)
    {
        try {
            $tkp = $this->MasterDataService->editMasterTkp($id_tkp, $request->all());
            return $this->baseResponse('Master Departemen berhasil update', null, $tkp, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master departemen', $e->getMessage(), null, 500);
        }
    }

    public function deleteMasterTkp(MasterTkp $id_tkp)
    {
        try {
            $tkp = $this->MasterDataService->deleteMasterTkp($id_tkp);
            return $this->baseResponse('Delete berhasil', null, $tkp, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui', $e->getMessage(), null, 500);
        }
    }

    public function createjaminan(Request $request)
    {
       
        try {
            $validatedData = $request->validate([
                'penjamin' => 'required|string',
                'kodeexternal'=>'nullable',
                'cdfix'=>'required',
                'is_active'=>'nullable',
            ]);
            $MasterDataService = $this->MasterDataService->createjaminan($validatedData);
            return $this->baseResponse('Master createjaminan berhasil dibuat', null, $MasterDataService, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat createjaminan', $e->getMessage(), null, 500);
        }
    }

    public function getMasterjaminan()
    {
        try {
            $jaminan = $this->MasterDataService->getMasterjaminan();
            return $this->baseResponse('Master jaminan berhasil didapatkan', null, $jaminan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master Tkp', $e->getMessage(), null, 500);
        }
    }

    public function editMasterjaminan(MasterJaminan $id_jaminan, Request $request)
    {
        try {
            $jaminan = $this->MasterDataService->editMasterjaminan($id_jaminan, $request->all());
            return $this->baseResponse('Master jaminan berhasil update', null, $jaminan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Master jaminan', $e->getMessage(), null, 500);
        }
    }

    public function deleteMasterjaminan(MasterJaminan $id_jaminan)
    {
        try {
            $jaminan = $this->MasterDataService->deleteMasterjaminan($id_jaminan);
            return $this->baseResponse('Delete berhasil', null, $jaminan, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui', $e->getMessage(), null, 500);
        }
    }

}
