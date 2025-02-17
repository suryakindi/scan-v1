<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SatuSehatTools extends Model
{
    use HasFactory;

    protected $table = 'satu_sehat_tools';

    protected $fillable = [
        'is_active',
        'kode_fayankes',
        'organization_id',
        'client_key',
        'secret_key',
        'id_base_url',
        'cdfix',
    ];
}
