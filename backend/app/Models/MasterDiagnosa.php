<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterDiagnosa extends Model
{
    protected $table = 'master_diagnosas';
    protected $fillable = [
        'kode_icd',
        'nama_icd',
        'nama_icd_indo',
        'kodeexternal',
        'is_active',
    ];
}
