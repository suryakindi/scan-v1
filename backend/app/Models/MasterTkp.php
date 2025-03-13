<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterTkp extends Model
{
    use HasFactory;
    protected $fillable = ['nama_tkp', 'is_active', 'cdfix', 'kodeexternal'];

}
