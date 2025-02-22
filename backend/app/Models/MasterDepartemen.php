<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterDepartemen extends Model
{
    use HasFactory;
    protected $fillable = ['nama_departemen', 'is_active', 'cdfix', 'kodeexternal'];

}
