<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterTindakan extends Model
{
    use HasFactory;
    protected $fillable = ['tindakan', 'harga', 'is_bpjs', 'kodeexternal','is_active', 'cdfix', 'created_by', 'updated_by', 'deleted_by', 'deleted_at'];

}
