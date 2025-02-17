<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

   
}
