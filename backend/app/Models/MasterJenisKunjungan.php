<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterJenisKunjungan extends Model
{
    use HasFactory;
    protected $table = 'master_jenis_kunjungans';
    protected $fillable = [
        'jenis_kunjungan',
        'is_active',
        'kode_bpjs',
    ];
}
