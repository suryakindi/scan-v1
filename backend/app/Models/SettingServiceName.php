<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SettingServiceName extends Model
{
    use HasFactory;
    protected $table = 'setting_service_names';

   
    protected $fillable = [
        'id_bpjs_tools', 
        'service_name',
        'id_base_url',
        'userkey',
        'username',
        'password'
    ];
}
