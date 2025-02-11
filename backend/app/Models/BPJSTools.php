<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BPJSTools extends Model
{
    use HasFactory;
    protected $table = 'bpjstools'; // Nama tabel di database

    protected $fillable = [
        'id_client',
        'cons_id',
        'secretkey',
        'provider_id',
    ];
}
