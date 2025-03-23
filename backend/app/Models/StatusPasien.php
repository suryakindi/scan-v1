<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusPasien extends Model
{
    use HasFactory;
    protected $table = 'status_pasiens';

   
    protected $fillable = [
        'status',
        'kodeexternal',
    ];
}
