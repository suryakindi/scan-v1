<?php

namespace App\Models\Lokasi;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'district_id', 'name'];
}
