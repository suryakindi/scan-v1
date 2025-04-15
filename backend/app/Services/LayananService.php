<?php

namespace App\Services;
use App\Models\RegistrasiDetailLayananPasien;
use App\Models\RegistrasiPasien;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\DB;

class LayananService
{
    public function daftarTeregistrasi($tglAwal = null, $tglAkhir = null, $search = null, $ruangan = null)
    {
        try {
            $cdFix = Auth()->user()->cdfix;

            $registrasi = RegistrasiDetailLayananPasien::join('registrasi_pasiens', 'registrasi_detail_layanan_pasiens.id_registrasi_pasien', '=', 'registrasi_pasiens.id')
                ->join('pasiens', 'registrasi_pasiens.id_pasien', '=', 'pasiens.id')
                ->leftJoin('master_ruangans', 'registrasi_detail_layanan_pasiens.id_ruangan', '=', 'master_ruangans.id')
                ->join('status_pasiens', 'registrasi_pasiens.status_pasien', '=', 'status_pasiens.id')
                ->leftjoin('status_pasiens as status_pulang', 'registrasi_pasiens.status_pulang', '=', 'status_pasiens.id')
                ->leftjoin('users as dokter', 'registrasi_detail_layanan_pasiens.id_dokter', '=', 'dokter.id')
                ->where('registrasi_pasiens.cdfix', $cdFix)
                ->whereNull('registrasi_pasiens.tanggal_pulang')
                ->whereNull('registrasi_pasiens.deleted_by')
                ->where('registrasi_detail_layanan_pasiens.is_active', true);
                
            if ($tglAwal && $tglAkhir) {
                if ($tglAwal) {
                    $tglAwal = DateTime::createFromFormat('d-m-Y', $tglAwal)->format('Y-m-d 00:00:00');
                }
    
                if ($tglAkhir) {
                    $tglAkhir = DateTime::createFromFormat('d-m-Y', $tglAkhir)->format('Y-m-d 23:59:59');
                }
    
                $registrasi->whereBetween('registrasi_pasiens.tanggal_registrasi', [$tglAwal, $tglAkhir]);
            }
    
            if ($search) {
                $registrasi->where(function ($query) use ($search) {
                    $query->where('pasiens.nama', 'ilike', '%' . $search . '%')
                        ->orWhere('registrasi_pasiens.no_registrasi', 'ilike', '%' . $search . '%');
                });
            }
            if ($ruangan) {
                $registrasi->where('master_ruangans.nama_ruangan', 'ilike', '%' . $ruangan . '%');
            }
            $registrasi = $registrasi->select(
                'registrasi_pasiens.id as id_registrasi',
                'pasiens.nama',
                'pasiens.no_bpjs',
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
                'dokter.name as dokter',
                DB::raw('(registrasi_pasiens.waktu_pemanggilan - registrasi_pasiens.tanggal_registrasi) as selisih_waktu')
                
            )
            ->paginate(100);
            return $registrasi;

        } catch (\Exception $e) {
            throw new \Exception("Gagal", $e->getMessage());
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
