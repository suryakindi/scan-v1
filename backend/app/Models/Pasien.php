<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    use HasFactory;

    protected $table = 'pasiens';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'is_active',
        'nama',
        'no_bpjs',
        'nik',
        'tempatlahir',
        'tanggal_lahir',
        'agama',
        'pendidikan_terakhir',
        'pekerjaan',
        'notelp',
        'nama_bapak',
        'nama_ibu',
        'status_perkawinan',
        'nama_pasangan',
        'golongan_darah',
        'id_alamat_pasien',
        'cdfix',
    ];
}
