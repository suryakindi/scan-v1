<?php

namespace App\Services;

use App\Models\RegistrasiDetailLayananPasien;
use App\Models\RegistrasiPasien;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Exception;
use Illuminate\Support\Facades\Hash;

class RegistrasiServices
{
    
    public function saveRegistrasiPasien(array $data)
    {

        DB::beginTransaction();
        try {
            // Format tanggal: YYYYMMDD
            $tanggal = Carbon::now()->format('Ymd');
    
            // Ambil jumlah registrasi pada hari ini untuk nomor urut
            $count = RegistrasiPasien::whereDate('tanggal_registrasi', Carbon::today())->count() + 1;
    
            // Format nomor registrasi: YYYYMMDD-NNNN
            $data['no_registrasi'] = $tanggal  . str_pad($count, 4, '0', STR_PAD_LEFT);
            $data['id_ruangan_terakhir'] = $data['id_ruangan_asal'];
            $data['created_by'] = auth()->user()->id;
            // Simpan ke database
            $registrasi = RegistrasiPasien::create($data);
    
            DB::commit();
            return $registrasi;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat Registrasi: " . $e->getMessage());
        }
    }

    public function saveRegistrasiDetailPasien($registrasi)
    {
      
        
        DB::beginTransaction();
        try {
            // Simpan ke database
           // Cek jumlah pasien di ruangan yang sama untuk menentukan noantrian
            $lastAntrian = RegistrasiDetailLayananPasien::where('id_ruangan', $registrasi->id_ruangan_asal)
            ->max('noantrian');

            $noantrian = $lastAntrian ? $lastAntrian + 1 : 1;

            // Cek jumlah pasien dengan dokter dan ruangan yang sama untuk menentukan noantriandokter
            $lastAntrianDokter = RegistrasiDetailLayananPasien::where('id_ruangan', $registrasi->id_ruangan_asal)
            ->where('id_dokter', $registrasi->id_dokter)
            ->max('noantriandokter');

            $noantriandokter = $lastAntrianDokter ? $lastAntrianDokter + 1 : 1;

            // Simpan data registrasi detail
            $registrasiDetail = new RegistrasiDetailLayananPasien;
            $registrasiDetail->id_registrasi_pasien = $registrasi->id;
            $registrasiDetail->id_ruangan = $registrasi->id_ruangan_asal;
            $registrasiDetail->id_dokter = $registrasi->id_dokter;
            $registrasiDetail->noantrian = $noantrian;
            $registrasiDetail->noantriandokter = $noantriandokter;
            $registrasiDetail->tanggal_masuk = $registrasi->tanggal_registrasi;
            $registrasiDetail->cdfix = $registrasi->cdfix;
            $registrasiDetail->created_by = auth()->user()->id;
            $registrasiDetail->save();

            $registrasiDetail->save();
    
            DB::commit();
            return $registrasiDetail;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat registrasiDetail: " . $e->getMessage());
        }       
    }
    
}
