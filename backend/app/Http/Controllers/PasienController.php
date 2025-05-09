<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasienRequest;
use App\Services\PasienService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Models\Pasien;


use Illuminate\Support\Facades\Validator;

class PasienController extends Controller
{
    protected PasienService $PasienService;

    public function __construct(PasienService $PasienService)
    {
        $this->PasienService = $PasienService;
    }



    public function createPasien(PasienRequest $request): JsonResponse
    {
        try {
            // Validasi data pasien dari request
            $validatedPasien = $request->validated();

            // Ambil alamat dari request
            $alamat = $request->input('alamat');

            // Validasi alamat manual di controller
            $validator = Validator::make($alamat ?? [], [

                'alamat' => 'required|max:255',
                'rt' => 'required|max:5',
                'rw' => 'required|max:5',
                'id_kelurahan' => 'required|max:255',
                'id_kecamatan' => 'required|max:255',
                'id_kabupaten' => 'required|max:255',
                'id_provinsi' => 'required|max:255',
                'cdfix' => 'required|max:255',
            ]);

            // Jika validasi alamat gagal, kembalikan response error
            if ($validator->fails()) {
                return $this->baseResponse('Validasi alamat gagal', $validator->errors(), null, 422);
            }

            // Panggil service untuk membuat pasien
            $pasien = $this->PasienService->createPasien($validatedPasien, $alamat);

            return $this->baseResponse('Pasien berhasil dibuat', null, $pasien, 201);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function getPasien(Request $request)
    {
        $cdfix = Auth()->user()->cdfix;
        try {
            $pasien = $this->PasienService->getPasien($cdfix, $request->all());
            return $this->baseResponse('Pasien berhasil didapatkan', null, $pasien, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function getPasienById($id_pasien)
    {
        $cdfix = Auth()->user()->cdfix;
        try {
            $pasien = $this->PasienService->getPasienById($cdfix, $id_pasien);
            return $this->baseResponse('Pasien berhasil didapatkan', null, $pasien, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function riwayatPasienById($id_pasien)
    {
        $cdfix = auth()->user()->cdfix;

        try {
            $data = $this->PasienService->riwayatPasienById($id_pasien, $cdfix);
            return $this->baseResponse('Pasien berhasil didapatkan', null, $data, 200);

        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function editPasienById(Pasien $id_pasien, Request $request)
    {
        try {
            $editPasien = $this->PasienService->editPasienById($id_pasien, $request->all());
            return $this->baseResponse('edit pasien berhasil diperbarui', null, $editPasien, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui data pasien', $e->getMessage(), null, 500);
        }
    }

    public function UpdateIHSNumber(Request $request, $id_pasien)
    {
        try {
            $pasien = $this->PasienService->updateIHSNumber($request->all(), $id_pasien);
            return $this->baseResponse('IHS Number berhasil diupdate', null, $pasien, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Gagal Update IHS Number', $e->getMessage(), null, 500);
        }
    }

}
