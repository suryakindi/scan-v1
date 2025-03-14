<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrasiPasien extends Model
{
    use HasFactory;

    protected $table = 'registrasi_pasiens';

  
    protected $fillable = [
        'id_pasien',
        'id_ruangan_asal',
        'id_ruangan_terakhir',
        'id_jenis_kunjungan',
        'id_jaminan',
        'id_tkp',
        'id_dokter',
        'no_registrasi',
        'tanggal_registrasi',
        'is_active',
        'cdfix',
        'created_by',
        'updated_by',
        'deleted_by'
    ];
}
