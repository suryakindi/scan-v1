<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterRuangan extends Model
{
    use HasFactory;
    protected $fillable = ['nama_ruangan', 'id_departemen', 'is_active', 'cdfix', 'kodeexternal'];

}
