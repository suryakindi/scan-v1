<?php

namespace App\Services;

use App\Models\GambarAnatomi;
use App\Models\MasterKesadaran;
use App\Models\RegistrasiDetailLayananPasien;
use App\Models\RegistrasiPasien;
use App\Models\Role;
use App\Models\Soap;
use App\Models\StatusPasien;
use App\Models\User;
use App\Models\VitalSign;
use Carbon\Carbon;
use DateTime;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LayananService
{
    public function daftarTeregistrasi($tglAwal = null, $tglAkhir = null, $search = null, $ruangan = null, array $dataRequest)
    {

        try {
            $cdFix = Auth()->user()->cdfix;
            $user = Auth()->user();

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
            if (isset($dataRequest['is_dokter']) && $dataRequest['is_dokter'] === true || isset($dataRequest['is_dokter']) && $dataRequest['is_dokter'] === 'true') {
                $registrasi->where('registrasi_detail_layanan_pasiens.id_dokter', $user->id);
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
                'registrasi_detail_layanan_pasiens.noantrianbpjs',
                'registrasi_pasiens.no_registrasi',
                'registrasi_pasiens.tanggal_registrasi',
                'master_ruangans.nama_ruangan',
                'dokter.name as dokter',
                DB::raw('(registrasi_pasiens.waktu_pemanggilan - registrasi_pasiens.tanggal_registrasi) as selisih_waktu')

            )
                ->paginate(100);
            return $registrasi;

        } catch (\Exception $e) {
            throw new \Exception("Gagal" . $e->getMessage());
        }
    }

    public function updateWaktuPemanggilan(RegistrasiPasien $id_registrasi)
    {

        DB::beginTransaction();
        try {
            $statusPasien = StatusPasien::where('status', 'Dilayani')->first();
            if ($statusPasien) {
                $id_registrasi->status_pasien = $statusPasien->id;
            } else {
                $id_registrasi->status_pasien = null;
            }
            $id_registrasi->waktu_pemanggilan = Carbon::now();
            $id_registrasi->updated_at = Carbon::now();
            $id_registrasi->updated_by = auth()->user()->id;
            $id_registrasi->save();
            DB::commit();
            return $id_registrasi;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Gagal", $e->getMessage());
        }
    }

    public function getUser($cdfix)
    {
        try {
            $user = User::where('cdfix', $cdfix)->where('is_active', true)->limit(100)->get();
            return $user;
        } catch (\Exception $e) {
            throw new \Exception("Gagal", $e->getMessage());
        }
    }

    public function daftarTeregistrasiById($id_registrasi)
    {

        try {
            $daftarTeregistrasi = RegistrasiPasien::where('registrasi_pasiens.id', $id_registrasi)
                ->join('registrasi_detail_layanan_pasiens', 'registrasi_pasiens.id', '=', 'registrasi_detail_layanan_pasiens.id_registrasi_pasien')
                ->join('pasiens', 'registrasi_pasiens.id_pasien', '=', 'pasiens.id')
                ->join('master_ruangans', 'registrasi_detail_layanan_pasiens.id_ruangan', '=', 'master_ruangans.id')
                ->leftjoin('users as dokter', 'registrasi_detail_layanan_pasiens.id_dokter', '=', 'dokter.id')
                ->leftjoin('vital_signs as vital_signs', 'vital_signs.id_registrasi_pasien', '=', 'registrasi_pasiens.id')
                ->select(
                    'pasiens.id as id_pasien',
                    'pasiens.nama',
                    'pasiens.nik as nik_pasien',
                    'pasiens.no_bpjs',
                    'registrasi_pasiens.id as id_registrasi_pasiens',
                    'registrasi_pasiens.no_registrasi as no_registrasi_pasien',
                    'master_ruangans.nama_ruangan',
                    'dokter.name as dokter',
                    'registrasi_detail_layanan_pasiens.noantrian',
                    'registrasi_detail_layanan_pasiens.tanggal_masuk',
                    'registrasi_detail_layanan_pasiens.id as id_registrasi_detail_layanan_pasiens',
                    'pasiens.tanggal_lahir',
                    'vital_signs.id as id_vital_signs',
                )
                ->where('registrasi_pasiens.is_active', true)->first();

            return $daftarTeregistrasi;
        } catch (\Exception $e) {
            throw new \Exception("Gagal: " . $e->getMessage(), $e->getCode());

        }
    }

    public function saveVitalSign(array $data)
    {
        DB::beginTransaction();
        try {
            $user = Auth()->user();

            if (isset($data["id_vital_signs"]) && $data["id_vital_signs"] !== null) {
                VitalSign::where("id", $data["id_vital_signs"])->update([
                    'updated_by' => $user->id,

                    'tekanan_darah' => $data['tekanan_darah_hh'] . '/' . $data['tekanan_darah_mg'],
                    'temperature' => $data['temperature'],
                    'nadi' => $data['nadi'],
                    'pernafasan' => $data['pernafasan'],
                    'berat_badan' => $data['berat_badan'],
                    'tinggi_badan' => $data['tinggi_badan'],
                    'lingkar_kepala' => $data['lingkar_kepala'],
                    'lingkar_perut' => $data['lingkar_perut'],
                    'lingkar_lengan' => $data['lingkar_lengan'],
                    'cara_ukur' => $data['cara_ukur'],
                    'kesadaran' => $data['kesadaran'],
                ]);
            } else {
                VitalSign::create([
                    'cdfix' => $user->cdfix,
                    'created_by' => $user->id,
                    'id_registrasi_pasien' => $data['id_registrasi_pasien'],
                    'no_registrasi' => $data['no_registrasi'],

                    'tekanan_darah' => $data['tekanan_darah_hh'] . '/' . $data['tekanan_darah_mg'],
                    'temperature' => $data['temperature'],
                    'nadi' => $data['nadi'],
                    'pernafasan' => $data['pernafasan'],
                    'berat_badan' => $data['berat_badan'],
                    'tinggi_badan' => $data['tinggi_badan'],
                    'lingkar_kepala' => $data['lingkar_kepala'],
                    'lingkar_perut' => $data['lingkar_perut'],
                    'lingkar_lengan' => $data['lingkar_lengan'],
                    'cara_ukur' => $data['cara_ukur'],
                    'kesadaran' => $data['kesadaran'],
                ]);
            }

            DB::commit();

            return $data;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Gagal: " . $e->getMessage(), $e->getCode());
        }
    }

    public function getVitalSignById(VitalSign $id_vital_sign)
    {
        $data = (object) [
            'id_vital_signs' => $id_vital_sign->id,
            'id_registrasi_pasien' => $id_vital_sign->id_registrasi_pasien,
            'no_registrasi' => $id_vital_sign->no_registrasi,
            'tekanan_darah_hh' => explode('/', $id_vital_sign->tekanan_darah)[0] ?? null,
            'tekanan_darah_mg' => explode('/', $id_vital_sign->tekanan_darah)[1] ?? null,
            'temperature' => $id_vital_sign->temperature,
            'nadi' => $id_vital_sign->nadi,
            'pernafasan' => $id_vital_sign->pernafasan,
            'berat_badan' => $id_vital_sign->berat_badan,
            'tinggi_badan' => $id_vital_sign->tinggi_badan,
            'lingkar_kepala' => $id_vital_sign->lingkar_kepala,
            'lingkar_perut' => $id_vital_sign->lingkar_perut,
            'lingkar_lengan' => $id_vital_sign->lingkar_lengan,
            'cara_ukur' => $id_vital_sign->cara_ukur,
            'kesadaran' => $id_vital_sign->kesadaran,
        ];

        return $data;
    }

    public function saveSOAP(array $data)
    {
        $user = auth()->user();
        $detail = RegistrasiDetailLayananPasien::find($data['id_registrasi_detail_layanan_pasiens']);

        if ($detail) {
            $registrasi = RegistrasiPasien::find($detail->id_registrasi_pasien);
            $registrasi->waktu_pemanggilan = Carbon::now();
            $registrasi->updated_at = Carbon::now();
            $registrasi->updated_by = auth()->user()->id;
            $statusPasien = StatusPasien::where('status', 'Dilayani')->first();

            if ($statusPasien) {
                $registrasi->status_pasien = $statusPasien->id;
                $registrasi->save();
            }
            if ($registrasi && is_null($detail->id_dokter) && is_null($registrasi->id_dokter)) {
                $dokterRole = Role::where('name', 'Dokter')->first();
                if ($user->role_id == $dokterRole->id) {
                    $detail->id_dokter = $user->id;
                    $registrasi->id_dokter = $user->id;

                    $detail->save();
                    $registrasi->save();
                }

            }
        }

        DB::beginTransaction();

        try {
            $dataToSave = [];
            $dataToSave['id_registrasi_detail_layanan_pasien'] = $data['id_registrasi_detail_layanan_pasiens'];
            $dataToSave['soap_details'] = json_encode($data['soap_details']);
            $dataToSave['updated_by'] = $user->id;
            $dataToSave['created_by'] = $user->id;
            $dataToSave['cdfix'] = $user->cdfix;

            Soap::upsert([$dataToSave], ['id_registrasi_detail_layanan_pasien'], ['soap_details', 'updated_by']);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }


    public function getSoapByIdRegistrasi($registrasiId)
    {
        try {
            $soap = Soap::where('id_registrasi_detail_layanan_pasien', $registrasiId)->first();
            $soap->soap_details = json_decode($soap->soap_details);

            return $soap;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
    public function getKesadaran()
    {
        try {
            $kesadaran = MasterKesadaran::where('is_active', TRUE)->get();
            return $kesadaran;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public function saveGambarMRecord(array $data)
    {
        DB::beginTransaction();
        try {
            $user = Auth()->user();
            $dataToSave = [
                'id_registrasi_detail_layanan_pasien' => $data['id_registrasi_detail_layanan_pasien'],
                'gambar' => $data['gambar'],
                'cdfix' => $user->cdfix,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ];

            GambarAnatomi::upsert($dataToSave, ['id_registrasi_detail_layanan_pasien'], ['gambar', 'updated_by']);
            DB::commit();

            $gambar = GambarAnatomi::where('id_registrasi_detail_layanan_pasien', $data['id_registrasi_detail_layanan_pasien'])->first();

            return $gambar;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception($e->getMessage());
        }
    }

    public function getGambarMRecord(int $id_registrasi_detail_layanan_pasien)
    {
        try {
            $gambar = GambarAnatomi::where('id_registrasi_detail_layanan_pasien', $id_registrasi_detail_layanan_pasien)->first();
            return $gambar;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
