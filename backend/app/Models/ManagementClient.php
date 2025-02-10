<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManagementClient extends Model
{
    use HasFactory;

    protected $table = 'management_clients'; // Nama tabel di database

    protected $fillable = [
        'is_active',
        'connect_bpjs',
        'nama_client',
        'notelp',
        'email',
        'website',
        'alamat',
        'kelurahan_id',
        'kecamatan_id',
        'kabupaten_id',
        'provinsi_id',
        'koordinat1',
        'koordinat2',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'connect_bpjs' => 'boolean',
        'koordinat1' => 'decimal:8',
        'koordinat2' => 'decimal:8',
    ];
}
