<?php

namespace App\Services;
use App\Models\RegistrasiDetailLayananPasien;

class LayananService
{
    public function daftarTeregistrasi()
    {
        try {
            $cdFix = Auth()->user()->cdfix;

            $registrasi = RegistrasiDetailLayananPasien::join('registrasi_pasiens', 'registrasi_detail_layanan_pasiens.id_registrasi_pasien', '=', 'registrasi_pasiens.id')
                ->join('pasiens', 'registrasi_pasiens.id_pasien', '=', 'pasiens.id')
                ->leftJoin('master_ruangans', 'registrasi_detail_layanan_pasiens.id_ruangan', '=', 'master_ruangans.id')
                ->where('registrasi_pasiens.cdfix', $cdFix)
                ->whereNull('registrasi_pasiens.tanggal_pulang')
                ->whereNull('registrasi_pasiens.deleted_by')
                ->where('registrasi_detail_layanan_pasiens.is_active', true)
                ->select(
                    'pasiens.nama',
                    'registrasi_detail_layanan_pasiens.noantrian',
                    'registrasi_pasiens.no_registrasi',
                    'registrasi_pasiens.tanggal_registrasi',
                    'master_ruangans.nama_ruangan' // Tambahan kolom ini
                )
                ->paginate(100);

            return $registrasi;

        } catch (\Exception $e) {
            throw new \Exception("Gagal", 1);
        }
    }

}
