<?php

namespace App\Services;
use App\Models\RegistrasiDetailLayananPasien;
use App\Models\RegistrasiPasien;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LayananService
{
    public function daftarTeregistrasi()
    {
        try {
            $cdFix = Auth()->user()->cdfix;

            $registrasi = RegistrasiDetailLayananPasien::join('registrasi_pasiens', 'registrasi_detail_layanan_pasiens.id_registrasi_pasien', '=', 'registrasi_pasiens.id')
                ->join('pasiens', 'registrasi_pasiens.id_pasien', '=', 'pasiens.id')
                ->leftJoin('master_ruangans', 'registrasi_detail_layanan_pasiens.id_ruangan', '=', 'master_ruangans.id')
                ->join('status_pasiens', 'registrasi_pasiens.status_pasien', '=', 'status_pasiens.id')
                ->leftjoin('status_pasiens as status_pulang', 'registrasi_pasiens.status_pulang', '=', 'status_pasiens.id')
                ->where('registrasi_pasiens.cdfix', $cdFix)
                ->whereNull('registrasi_pasiens.tanggal_pulang')
                ->whereNull('registrasi_pasiens.deleted_by')
                ->where('registrasi_detail_layanan_pasiens.is_active', true)
                ->select(
                    'registrasi_pasiens.id as id_registrasi',
                    'pasiens.nama',
                    'registrasi_detail_layanan_pasiens.id_ruangan',
                    'registrasi_pasiens.waktu_pemanggilan',
                    'registrasi_pasiens.status_pulang as id_status_pulang',
                    'status_pulang.status as status_pulang',
                    'registrasi_pasiens.status_pasien as id_status_pasien',
                    'status_pasiens.status as status_pasien',
                    'registrasi_detail_layanan_pasiens.noantrian',
                    'registrasi_pasiens.no_registrasi',
                    'registrasi_pasiens.tanggal_registrasi',
                    'master_ruangans.nama_ruangan',
                    DB::raw('(registrasi_pasiens.waktu_pemanggilan - registrasi_pasiens.tanggal_registrasi) as selisih_waktu')
                    
                )
                ->paginate(100);

            return $registrasi;

        } catch (\Exception $e) {
            throw new \Exception("Gagal", 1);
        }
    }

    public function updateWaktuPemanggilan(RegistrasiPasien $id_registrasi)
    {
        DB::beginTransaction();   
        try {
           $id_registrasi->waktu_pemanggilan = Carbon::now();
           $id_registrasi->status_pasien = 4;
           $id_registrasi->updated_at = Carbon::now();
           $id_registrasi->updated_by = auth()->user()->id;
           $id_registrasi->save();
           DB::commit();
           return $id_registrasi;
        } catch (\Exception $e) {
            throw new \Exception("Gagal", $e->getMessage());
        }
    }

}
