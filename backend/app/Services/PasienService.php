<?php

namespace App\Services;

use App\Models\AlamatPasien;
use App\Models\Pasien;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class PasienService
{   

 
    public function createPasien(array $pasienData, array $alamatData)
    {
        DB::beginTransaction();
    
        try {
            return response()->json($pasienData);
            // 1. Simpan data pasien terlebih dahulu tanpa `id_alamat_pasien`
            $pasien = Pasien::create($pasienData);
    
            // 2. Simpan data alamat dengan `id_pasien`
            $alamatData['id_pasien'] = $pasien->id; // Hubungkan alamat ke pasien
            $alamat = AlamatPasien::create($alamatData);
    
            // 3. Update pasien dengan `id_alamat_pasien` yang baru saja dibuat
            $pasien->update(['id_alamat_pasien' => $alamat->id]);
    
            DB::commit();
            return $pasien;
    
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception('Gagal membuat pasien dan alamat: ' . $e->getMessage());
        }
    }

    public function getPasien($cdfix)
    {
        try {
            $pasien = Pasien::where('cdfix', $cdfix)->paginate(100);
            return $pasien;
        } catch (\Exception $e) {
            throw new \Exception('Gagal mendapatkan pasien: ' . $e->getMessage());
        }
    }

    public function updateIHSNumber($data, $id_pasien)
    {
        DB::beginTransaction();
        try {
            $pasien = Pasien::find($id_pasien);
            $pasien->update($data);
            DB::commit();
            return $pasien;
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }
    
}
