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
            // Cek jika norm adalah "is_auto", maka generate otomatis
            if ($pasienData['norm'] === "is_auto") {
                $latestPasien = Pasien::latest()->first(); // Ambil pasien terakhir
                $lastNorm = $latestPasien ? intval($latestPasien->norm) : 0; // Ambil nomor terakhir
                $newNorm = str_pad($lastNorm + 1, 6, '0', STR_PAD_LEFT); // Format dengan 6 digit
                $pasienData['norm'] = $newNorm;
            }

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


    public function getPasien($cdfix, array $data = [])
    {
        try {
            $query = Pasien::where('cdfix', $cdfix)->with('alamat');
    
            if (!empty($data['search'])) {
                $search = $data['search'];
                $query->where(function ($q) use ($search) {
                    $q->whereRaw("norm ILIKE ?", ["%$search%"])
                      ->orWhereRaw("nama ILIKE ?", ["%$search%"])
                      ->orWhereRaw("nik ILIKE ?", ["%$search%"]);
                });
            }
    
            $pasien = $query->paginate(100);
    
            return response()->json([
                'success' => true,
                'message' => 'Data pasien berhasil diambil',
                'data' => $pasien
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mendapatkan pasien: ' . $e->getMessage()
            ], 500);
        }
    }
    

    public function getPasienById($cdfix, $id_pasien)
    {
        try {
            $pasien = Pasien::where('cdfix', $cdfix)->with('alamat')->where('id', $id_pasien)->where('is_active', TRUE)->first();
            if($pasien == null){
                throw new \Exception('Tidak Ada Data');
            }
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
