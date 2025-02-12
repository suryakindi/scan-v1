<?php

namespace App\Http\Controllers;

use App\Models\Lokasi\District;
use App\Models\Lokasi\Province;
use App\Models\Lokasi\Regencies;
use App\Models\Lokasi\Village;
use Illuminate\Http\Request;

class LokasiController extends Controller
{
    public function provinces(Request $request)
    {
        try {
            $provinces = Province::all();
            return $this->baseResponse('Success', '', $provinces, 200);
        } catch (\Throwable $th) {
            return $this->baseResponse('Gagal', $th->getMessage(), null, 500);
        }
    }

    public function regencies(Request $request)
    {
        try {
            $regencies = Regencies::where('province_id', $request->province_id)->get();
            return $this->baseResponse('Success', '', $regencies, 200);
        } catch (\Throwable $th) {
            return $this->baseResponse('Gagal', $th->getMessage(), null, 500);
        }
    }

    public function districts(Request $request)
    {
        try {
            $districts = District::where('regency_id', $request->regency_id)->get();
            return $this->baseResponse('Success', '', $districts, 200);
        } catch (\Throwable $th) {
            return $this->baseResponse('Gagal', $th->getMessage(), null, 500);
        }
    }

    public function villages(Request $request)
    {
        try {
            $villages = Village::where('district_id', $request->district_id)->get();
            return $this->baseResponse('Success', '', $villages, 200);
        } catch (\Throwable $th) {
            return $this->baseResponse('Gagal', $th->getMessage(), null, 500);
        }
    }
}
