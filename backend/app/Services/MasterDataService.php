<?php

namespace App\Services;

use App\Models\MappingDokterRuangan;
use App\Models\MasterAlergi;
use App\Models\MasterDepartemen;
use App\Models\MasterDiagnosa;
use App\Models\MasterJaminan;
use App\Models\MasterJenisKunjungan;
use App\Models\MasterRuangan;
use App\Models\MasterTkp;
use App\Models\Module;
use App\Models\Permission;
use App\Models\RegistrasiDetailLayananPasien;
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
            $alergi = MasterAlergi::where('is_active', TRUE)->paginate(100);
            return $alergi;
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
                'is_active' => false,
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
                'is_active' => false,
            ]);
            DB::commit();
            return $id_jeniskunjungan;
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception("Gagal Update jeniskunjungan: " . $e->getMessage());
        }
    }


    public function getMasterJenisKunjungan()
    {
        try {
            $jeniskunjungan = MasterJenisKunjungan::where('is_active', TRUE)->paginate(100);
            return $jeniskunjungan;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan jeniskunjungan: " . $e->getMessage());
        }
    }
    public function getMasterDiagnosa($SearchQuery = null)
    {
        try {
            $diagnosa = MasterDiagnosa::where('is_active', true);

            if (!empty($SearchQuery)) {
                $diagnosa->where(function ($q) use ($SearchQuery) {
                    $q->where('nama_icd_indo', 'ilike', '%' . $SearchQuery . '%')
                        ->orWhere('kode_icd', 'ilike', '%' . $SearchQuery . '%');
                });
            }

            return $diagnosa->paginate(100); // Perbaikan: Return hasil query
        } catch (\Throwable $e) { // Menggunakan Throwable untuk menangkap semua error
            throw new \Exception("Gagal mendapatkan Master Diagnosa: " . $e->getMessage());
        }
    }

    public function createDepartemen(array $data)
    {
        DB::beginTransaction();
        try {
            $departemen = MasterDepartemen::create($data);
            DB::commit();
            return $departemen;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat departemen: " . $e->getMessage());
        }
    }

    public function getMasterDepartemen()
    {
        try {
            $departemen = MasterDepartemen::where('is_active', TRUE)->paginate(100);
            return $departemen;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function editMasterJenisDepartemen(MasterDepartemen $id_departemen, array $data)
    {
        DB::beginTransaction();
        try {
            $id_departemen->update($data);
            DB::commit();
            return $id_departemen;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteMasterDepartemen(MasterDepartemen $id_departemen)
    {
        DB::beginTransaction();
        try {
            $id_departemen->update([
                'is_active' => false
            ]);
            DB::commit();
            return $id_departemen;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createMasterRuangan(array $data)
    {
        DB::beginTransaction();
        try {
            $Ruangan = MasterRuangan::create($data);
            DB::commit();
            return $Ruangan;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat ruangan: " . $e->getMessage());
        }
    }

    public function editMasterRuangan(MasterRuangan $id_ruangan, array $data)
    {
        DB::beginTransaction();
        try {
            $id_ruangan->update($data);
            DB::commit();
            return $id_ruangan;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteMasterRuangan(MasterRuangan $id_ruangan)
    {
        DB::beginTransaction();
        try {
            $id_ruangan->update([
                'is_active' => false
            ]);
            DB::commit();
            return $id_ruangan;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getMasterRuangan($id_client)
    {
        try {
            $getMasterRuangan = MasterRuangan::join('master_departemens', 'master_departemens.id', '=', 'master_ruangans.id_departemen')
                ->where('master_ruangans.is_active', true)
                ->where('master_ruangans.cdfix', $id_client)
                ->select('master_ruangans.*', 'master_departemens.nama_departemen')
                ->paginate(100);
            return $getMasterRuangan;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Ruangan: " . $e->getMessage());
        }
    }

    public function createTkp(array $data)
    {
        DB::beginTransaction();
        try {
            $tkp = MasterTkp::create($data);
            DB::commit();
            return $tkp;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat tkp: " . $e->getMessage());
        }
    }

    public function getMasterTkp()
    {
        try {
            $tkp = MasterTkp::where('is_active', TRUE)->paginate(100);
            return $tkp;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function editMasterTkp(MasterTkp $id_tkp, array $data)
    {

        DB::beginTransaction();
        try {
            $id_tkp->update($data);
            DB::commit();
            return $id_tkp;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteMasterTkp(MasterTkp $id_tkp)
    {
        DB::beginTransaction();
        try {
            $id_tkp->update([
                'is_active' => false
            ]);
            DB::commit();
            return $id_tkp;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createjaminan(array $data)
    {
        DB::beginTransaction();
        try {
            $jaminan = MasterJaminan::create($data);
            DB::commit();
            return $jaminan;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat jaminan: " . $e->getMessage());
        }
    }

    public function getMasterjaminan()
    {
        try {
            $jaminan = MasterJaminan::where('is_active', TRUE)->paginate(100);
            return $jaminan;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function editMasterjaminan(MasterJaminan $id_jaminan, array $data)
    {

        DB::beginTransaction();
        try {
            $id_jaminan->update($data);
            DB::commit();
            return $id_jaminan;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteMasterjaminan(MasterJaminan $id_jaminan)
    {
        DB::beginTransaction();
        try {
            $id_jaminan->update([
                'is_active' => false
            ]);
            DB::commit();
            return $id_jaminan;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function mappingDokterRuangan(array $data)
    {
        DB::beginTransaction();
        try {
            $mappingDokterRuangan = MappingDokterRuangan::create($data);
            DB::commit();
            return $mappingDokterRuangan;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat mappingDokterRuangan: " . $e->getMessage());
        }
    }

    public function editMappingDokterRuangan(MappingDokterRuangan $id_mapping, array $data)
    {
        DB::beginTransaction();
        try {
            $id_mapping->update($data);
            DB::commit();
            return $id_mapping;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteMappingDokterRuangan(MappingDokterRuangan $id_mapping)
    {
        DB::beginTransaction();
        try {
            $id_mapping->update([
                'is_active' => false
            ]);
            DB::commit();
            return $id_mapping;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getMappingDokterRuangan($id_ruangan)
    {
        try {
            $mappingDokterRuangan = MappingDokterRuangan::where('mapping_dokter_ruangans.is_active', TRUE)
                ->where('id_ruangan', $id_ruangan)
                ->join('users', 'users.id', '=', 'mapping_dokter_ruangans.id_user')
                ->join('master_ruangans', 'master_ruangans.id', '=', 'mapping_dokter_ruangans.id_ruangan')
                ->select('mapping_dokter_ruangans.id_user', 'users.name', 'master_ruangans.nama_ruangan')
                ->paginate(100);
            return $mappingDokterRuangan;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getMappingDokterRuanganArray(array $id_ruangan)
    {
        try {
            $mappingDokterRuangan = MappingDokterRuangan::where('mapping_dokter_ruangans.is_active', TRUE)
                ->whereIn('id_ruangan', $id_ruangan)
                ->join('users', 'users.id', '=', 'mapping_dokter_ruangans.id_user')
                ->join('master_ruangans', 'master_ruangans.id', '=', 'mapping_dokter_ruangans.id_ruangan')
                ->select('mapping_dokter_ruangans.id_user', 'users.name', 'master_ruangans.nama_ruangan')
                ->paginate(100);
            return $mappingDokterRuangan;
        } catch (\Exception $e) {
            throw $e;
        }
    }


    public function getAntrianViewer($cdfix, $id_ruangan)
    {
        if (!is_array($id_ruangan)) {
            $id_ruangan = explode(',', $id_ruangan); // Ubah string jadi array jika dipisahkan koma
        }
        try {

            $antrianViewer = RegistrasiDetailLayananPasien::where('registrasi_detail_layanan_pasiens.is_active', TRUE)
                ->where('registrasi_detail_layanan_pasiens.cdfix', $cdfix)
                ->whereIn('registrasi_detail_layanan_pasiens.id_ruangan', $id_ruangan)
                ->where('registrasi_detail_layanan_pasiens.tanggal_keluar', null)
                ->join('master_ruangans', 'master_ruangans.id', '=', 'registrasi_detail_layanan_pasiens.id_ruangan')
                ->join('registrasi_pasiens', 'registrasi_pasiens.id', '=', 'registrasi_detail_layanan_pasiens.id_registrasi_pasien')
                ->join('pasiens', 'pasiens.id', '=', 'registrasi_pasiens.id_pasien')
                ->select('registrasi_detail_layanan_pasiens.noantrian', 'pasiens.nama', 'pasiens.id as id_pasien', 'master_ruangans.id as id_ruangan', 'master_ruangans.nama_ruangan')
                ->get();
            return $antrianViewer;
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
