<?php

namespace App\Services;

use App\Models\MasterAlergi;
use App\Models\MasterJenisKunjungan;
use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use App\Models\UserPermission;
use Illuminate\Support\Facades\DB;
use Exception;

class MasterDataService
{
    /**
     * Create a new baseurl.
     *
     * @param array $data
     * @return MasterDataService
     * @throws Exception
     */

    public function createMasterAlergi(array $data)
    {
        DB::beginTransaction();
        try {
            $client = MasterAlergi::create($data);
            DB::commit();
            return $client;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat client: " . $e->getMessage());
        }
    }

    public function getMasterAlergi()
    {
        try {
            $client = MasterAlergi::where('is_active', TRUE)->paginate(100);
            return $client;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Alergi: " . $e->getMessage());
        }
    }

    public function updateMasterAlergi(MasterAlergi $alergi, array $data)
    {
        DB::beginTransaction();
        try {
            $alergi->update($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback(); 
            throw new \Exception("Gagal Update Alergi: " . $e->getMessage());
        }
    }
    
    public function deleteAlergi(MasterAlergi $alergi)
    {
        DB::beginTransaction();
        try {
            $alergi->update([
                'is_active'=>false,
            ]);
            DB::commit();
            return $alergi;
        } catch (\Exception $e) {
            DB::rollback(); 
            throw new \Exception("Gagal Update Alergi: " . $e->getMessage());
        }
    }

    public function createMasterJenisKunjungan(array $data)
    {
        DB::beginTransaction();
        try {
            $jeniskunjungan = MasterJenisKunjungan::create($data);
            DB::commit();
            return $jeniskunjungan;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat jeniskunjungan: " . $e->getMessage());
        }
    }

    public function updateMasterJenisKunjungan(MasterJenisKunjungan $jeniskunjungan, array $data)
    {
        DB::beginTransaction();
        try {
            $jeniskunjungan->update($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback(); 
            throw new \Exception("Gagal Update jeniskunjungan: " . $e->getMessage());
        }
    }

     
    public function deleteMasterJenisKunjungan(MasterJenisKunjungan $id_jeniskunjungan)
    {
        DB::beginTransaction();
        try {
            $id_jeniskunjungan->update([
                'is_active'=>false,
            ]);
            DB::commit();
            return $id_jeniskunjungan;
        } catch (\Exception $e) {
            DB::rollback(); 
            throw new \Exception("Gagal Update jeniskunjungan: " . $e->getMessage());
        }
    }
}
