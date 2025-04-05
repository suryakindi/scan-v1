<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lokasi\Province;
use App\Models\Lokasi\Regencies;
use App\Models\Lokasi\District;
use App\Models\Lokasi\Village;

class AlamatPasien extends Model
{
    use HasFactory;

    protected $table = 'alamat_pasiens';

    protected $fillable = [
        'is_active',
        'id_pasien',
        'alamat',
        'rt',
        'rw',
        'id_kelurahan',
        'id_kecamatan',
        'id_kabupaten',
        'id_provinsi',
        'cdfix',
    ];

    public function provinsi()
    {
        return $this->belongsTo(Province::class, 'id_provinsi', 'id');
    }

    public function kabupaten()
    {
        return $this->belongsTo(Regencies::class, 'id_kabupaten', 'id');
    }

    public function kecamatan()
    {
        return $this->belongsTo(District::class, 'id_kecamatan', 'id');
    }

    public function kelurahan()
    {
        return $this->belongsTo(Village::class, 'id_kelurahan', 'id');
    }


}
