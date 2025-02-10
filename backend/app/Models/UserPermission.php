<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'module_id',
        'can_view',
        'can_create',
        'can_edit',
        'can_delete',
    ];
}
