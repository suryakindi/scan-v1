<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MappingDokterRuangan extends Model
{
    use HasFactory;

    protected $table = 'mapping_dokter_ruangans';

    protected $fillable = [
        'id_ruangan',
        'id_user',
        'is_active',
    ];
}
