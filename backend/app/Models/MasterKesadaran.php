<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterKesadaran extends Model
{
    protected $fillable = [
        'kesadaran',
        'kodeexternal',
        'is_active',
        'cdfix',
        'created_by',
        'updated_by',
        'deleted_by',
        'deleted_at',
    ];
    
    use HasFactory;
}
