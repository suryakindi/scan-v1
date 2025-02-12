<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterAlergi extends Model
{
    use HasFactory;
    protected $table = 'master_alergis';
    protected $fillable = [
        'nama_alergi',
        'kode_bpjs',
    ];
}
