<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaseUrl extends Model
{
    use HasFactory;
    protected $table = 'base_urls'; // Nama tabel di database

    protected $fillable = [
        'base_url',
        'kdAplikasi',
    ];
}
