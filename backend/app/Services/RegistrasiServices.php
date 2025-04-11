<?php

namespace App\Services;

use App\Models\RegistrasiDetailLayananPasien;
use App\Models\RegistrasiPasien;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use DateTime;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegistrasiServices
{

    public function saveRegistrasiPasien(array $data)
    {
        DB::beginTransaction();
        try {
            // Cek apakah pasien masih memiliki pendaftaran yang belum selesai
            $existingRegistration = RegistrasiPasien::where('id_pasien', $data['id_pasien'])
                ->whereNull('tanggal_pulang')
                ->exists();

            if ($existingRegistration) {
                throw new Exception("Pasien masih memiliki pendaftaran yang belum selesai.");
            }

            // Format tanggal: YYYYMMDD
            $tanggal = Carbon::now()->format('Ymd');

            // Ambil jumlah registrasi pada hari ini untuk nomor urut
            $count = RegistrasiPasien::whereDate('tanggal_registrasi', Carbon::today())->count() + 1;

            // Format nomor registrasi: YYYYMMDD-NNNN
            $data['no_registrasi'] = $tanggal . str_pad($count, 4, '0', STR_PAD_LEFT);
            $data['id_ruangan_terakhir'] = $data['id_ruangan_asal'];
            $data['id_tkp'] = 1;
            $data['status_pasien'] = 3;
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
            // Ambil tanggal registrasi pasien
            $tanggalRegistrasi = $registrasi->tanggal_registrasi;

            // Cek jumlah pasien di ruangan yang sama pada hari yang sama untuk menentukan noantrian
            $lastAntrian = RegistrasiDetailLayananPasien::where('id_ruangan', $registrasi->id_ruangan_asal)
                ->whereDate('tanggal_masuk', $tanggalRegistrasi) // Tambahkan filter tanggal
                ->max('noantrian');

            $noantrian = $lastAntrian ? $lastAntrian + 1 : 1;

            // Cek jumlah pasien dengan dokter dan ruangan yang sama pada hari yang sama untuk menentukan noantriandokter
            $lastAntrianDokter = RegistrasiDetailLayananPasien::where('id_ruangan', $registrasi->id_ruangan_asal)
                ->where('id_dokter', $registrasi->id_dokter)
                ->whereDate('tanggal_masuk', $tanggalRegistrasi) // Tambahkan filter tanggal
                ->max('noantriandokter');

            $noantriandokter = $lastAntrianDokter ? $lastAntrianDokter + 1 : 1;

            // Simpan data registrasi detail
            $registrasiDetail = new RegistrasiDetailLayananPasien;
            $registrasiDetail->id_registrasi_pasien = $registrasi->id;
            $registrasiDetail->id_ruangan = $registrasi->id_ruangan_asal;
            $registrasiDetail->id_dokter = $registrasi->id_dokter;
            $registrasiDetail->noantrian = $noantrian;
            $registrasiDetail->noantriandokter = $noantriandokter;
            $registrasiDetail->tanggal_masuk = $tanggalRegistrasi;
            $registrasiDetail->cdfix = $registrasi->cdfix;
            $registrasiDetail->created_by = auth()->user()->id;
            $registrasiDetail->save();

            DB::commit();
            return $registrasiDetail;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat registrasiDetail: " . $e->getMessage());
        }
    }


    public function listRegistrasiPasien($tglAwal = null, $tglAkhir = null, $search = null, $ruangan = null)
    {
        $cdFix = Auth()->user()->cdfix;
    
        $registrasi = RegistrasiDetailLayananPasien::join('registrasi_pasiens', 'registrasi_detail_layanan_pasiens.id_registrasi_pasien', '=', 'registrasi_pasiens.id')
            ->join('pasiens', 'registrasi_pasiens.id_pasien', '=', 'pasiens.id')
            ->join('master_ruangans', 'registrasi_detail_layanan_pasiens.id_ruangan', '=', 'master_ruangans.id')
            ->leftJoin('users as dokter', 'registrasi_detail_layanan_pasiens.id_dokter', '=', 'dokter.id')
            ->join('users', 'registrasi_pasiens.created_by', '=', 'users.id')
            ->join('status_pasiens', 'registrasi_pasiens.status_pasien', '=', 'status_pasiens.id')
            ->join('master_jaminans', 'registrasi_pasiens.id_jaminan', '=', 'master_jaminans.id')
            ->where('registrasi_pasiens.cdfix', $cdFix)
            ->where(function ($query) {
                $query->whereNotNull('registrasi_detail_layanan_pasiens.noantriandokter')
                    ->orWhereNotNull('registrasi_detail_layanan_pasiens.noantrian');
            })
            ->whereNull('registrasi_detail_layanan_pasiens.tanggal_keluar')
            ->whereNull('registrasi_pasiens.tanggal_pulang')
            ->where('registrasi_pasiens.is_active', '=', true)
            ->where('registrasi_detail_layanan_pasiens.is_active', '=', true);
    
        
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
        if($ruangan){
            $registrasi->where('master_ruangans.nama_ruangan', 'ilike', '%'.$ruangan.'%');
        }
        
        $registrasi = $registrasi->select(
                'pasiens.nama',
                'pasiens.id as id_pasien',
                'registrasi_detail_layanan_pasiens.id as id_registrasi_detail_layanan',
                'master_ruangans.id as id_ruangan',
                'dokter.id as id_dokter',
                'registrasi_pasiens.no_registrasi',
                'registrasi_pasiens.id as id_registrasi',
                'registrasi_detail_layanan_pasiens.tanggal_masuk',
                'registrasi_detail_layanan_pasiens.noantrian',
                'master_jaminans.penjamin',
                'master_ruangans.nama_ruangan',
                'dokter.name as dokter',
                'status_pasiens.status',
                'users.name as created_by'
            )
            ->paginate(100);
    
        return $registrasi;
    }
    

    public function BatalRegistrasi($id_registrasi)
    {
        DB::beginTransaction();
        try {
            $registrasi = RegistrasiPasien::find($id_registrasi);
            $registrasiDetail = RegistrasiDetailLayananPasien::where('id_registrasi_pasien', $registrasi->id)->first();
            $registrasi->is_active = false;
            $registrasi->tanggal_pulang = Carbon::now();
            $registrasi->status_pasien = 10;
            $registrasi->updated_at = Carbon::now();
            $registrasi->updated_by = auth()->user()->id;
            $registrasi->save();
            $registrasiDetail->is_active = false;
            $registrasiDetail->updated_by = auth()->user()->id;
            $registrasiDetail->tanggal_keluar = Carbon::now();
            $registrasiDetail->updated_at = Carbon::now();
            $registrasiDetail->save();
            DB::commit();
            return $registrasi;
        } catch (\Exception $e) {
            throw new Exception($e->getMessage());

        }

    }

    public function editRegistrasiLayananPasien($id_registrasi, $data)
    {
        
        DB::beginTransaction();
        try {
            $layananRegistrasi = RegistrasiPasien::find($id_registrasi);
            if($layananRegistrasi->status_pasien != 3){
                throw new Exception("Pasien Sudah Di Layani");
            }
            $layananRegistrasi->id_ruangan_asal = $data['id_ruangan_asal'];
            $layananRegistrasi->id_ruangan_terakhir = $data['id_ruangan_asal'];
            $layananRegistrasi->id_jenis_kunjungan = $data['id_jenis_kunjungan'];
            $layananRegistrasi->id_jaminan = $data['id_jaminan'];
            $layananRegistrasi->updated_at = Carbon::now();
            $layananRegistrasi->updated_by = auth()->user()->id;
            $detailLayananRegistrasi = RegistrasiDetailLayananPasien::where('id_registrasi_pasien', $layananRegistrasi->id)->first();
            $detailLayananRegistrasi->id_ruangan = $data['id_ruangan_asal'];
            $detailLayananRegistrasi->updated_at  = Carbon::now();
            $detailLayananRegistrasi->updated_by = auth()->user()->id;
            $detailLayananRegistrasi->save();
            $layananRegistrasi->save();
            DB::commit();
            return $layananRegistrasi;
        } catch (\Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function getRegistrasiLayananPasien($id_registrasi){
       try {
           $registrasi = RegistrasiPasien::where('id', $id_registrasi)->select('id as id_registrasi_pasien','id_pasien', 'id_ruangan_asal', 'id_jaminan', 'id_jenis_kunjungan', 'no_registrasi', 'tanggal_registrasi')->first();
           
           return $registrasi;
       } catch (\Exception $e) {
           throw new Exception($e->getMessage());
       }
    }
}
