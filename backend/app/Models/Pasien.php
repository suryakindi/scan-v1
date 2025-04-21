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
        'norm',
        'is_active',
        'nama',
        'no_bpjs',
        'ihs_number',
        'nik',
        'tempatlahir',
        'tanggal_lahir',
        'agama',
        'pendidikan_terakhir',
        'pekerjaan',
        'notelp',
        'jenis_kelamin',
        'nama_bapak',
        'nama_ibu',
        'status_perkawinan',
        'nama_pasangan',
        'golongan_darah',
        'id_alamat_pasien',
        'cdfix',
    ];

    public function alamatPasien()
    {
        return $this->hasOne(AlamatPasien::class, 'id', 'id_alamat_pasien');
    }
}
