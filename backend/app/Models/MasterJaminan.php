<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterJaminan extends Model
{
    use HasFactory;
    protected $fillable = ['penjamin', 'is_active', 'cdfix', 'kodeexternal'];

}
