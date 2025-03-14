<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrasiDetailLayananPasien extends Model
{
    use HasFactory;

    protected $table = 'registrasi_detail_layanan_pasiens';

    protected $fillable = [
        'id_registrasi_pasien',
        'id_ruangan',
        'id_dokter',
        'noantrian',
        'noantriandokter',
        'tanggal_masuk',
        'tanggal_keluar',
        'created_by',
        'updated_by',
        'deleted_by',
        'is_active',
        'cdfix'
    ];
}
