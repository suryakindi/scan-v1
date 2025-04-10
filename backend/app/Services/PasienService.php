<?php

namespace App\Services;

use App\Models\AlamatPasien;
use App\Models\Pasien;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


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
            $query = Pasien::where('cdfix', $cdfix)->with('alamatPasien');

            if (!empty($data['search'])) {
                $search = $data['search'];
                $query->where(function ($q) use ($search) {
                    $q->whereRaw("norm ILIKE ?", ["%$search%"])
                        ->orWhereRaw("nama ILIKE ?", ["%$search%"])
                        ->orWhereRaw("nik ILIKE ?", ["%$search%"]);
                });
            }

            $pasien = $query->paginate(100);

            return $pasien;
        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
    }


    public function getPasienById($cdfix, $id_pasien)
    {
        try {
            $pasien = Pasien::where('cdfix', $cdfix)->with('alamatPasien')->where('id', $id_pasien)->where('is_active', TRUE)->first();
            if ($pasien == null) {
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


    public function riwayatPasienById($id_pasien, $cdfix)
    {
        try {
            $data = DB::table('pasiens')
                ->join('registrasi_pasiens', 'pasiens.id', '=', 'registrasi_pasiens.id_pasien')
                ->join('registrasi_detail_layanan_pasiens as rdgp', 'registrasi_pasiens.id', '=', 'rdgp.id_registrasi_pasien')
                ->join('master_ruangans as ruangan_asal', 'registrasi_pasiens.id_ruangan_asal', '=', 'ruangan_asal.id')
                ->join('master_ruangans as ruangan_terakhir', 'registrasi_pasiens.id_ruangan_terakhir', '=', 'ruangan_terakhir.id')
                ->join('master_jaminans', 'registrasi_pasiens.id_jaminan', '=', 'master_jaminans.id')
                ->where('pasiens.id', $id_pasien)
                ->where('registrasi_pasiens.is_active', '=', true)
                ->where('pasiens.cdfix', $cdfix)
                ->select(
                    'pasiens.id as id_pasien',
                    'pasiens.nama',
                    'registrasi_pasiens.id as id_registrasi',
                    'registrasi_pasiens.no_registrasi',
                    'registrasi_pasiens.tanggal_registrasi',
                    'ruangan_asal.nama_ruangan as nama_ruangan_asal',
                    'ruangan_terakhir.nama_ruangan as nama_ruangan_terakhir',
                    'registrasi_pasiens.id_jaminan',
                    'master_jaminans.nama_jaminan',
                    'rdgp.tanggal_masuk',
                    'rdgp.tanggal_keluar'
                )
                ->get();

            if ($data->isEmpty()) {
                throw new \Exception('Tidak Ada mendapatkan data riwayat pasien: ');
            }
            return $data;
        } catch (\Exception $e) {
            throw new \Exception('Gagal mendapatkan data riwayat pasien: ' . $e->getMessage());
        }

    }

    public function editPasienById(Pasien $id_pasien, array $data)
    {
        DB::beginTransaction();
        try {

            $id_pasien->update($data);

            if (isset($data['alamat_pasien'])) {
                $alamat = AlamatPasien::find($id_pasien->id_alamat_pasien);
                if ($alamat) {
                    $alamat->update($data['alamat_pasien']);
                }
            }

            DB::commit();

            return $id_pasien->load([
                'alamatPasien.provinsi',
                'alamatPasien.kabupaten',
                'alamatPasien.kecamatan',
                'alamatPasien.kelurahan'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception("Gagal Update Pasien & Alamat: " . $e->getMessage());
        }
    }

}
