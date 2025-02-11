<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;
use DB;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $module, $action)
    {
        if (!$module || !$action) {
            return response()->json(['message' => 'Middleware permission membutuhkan parameter module dan action'], 400);
        }
        
        $user = Auth::user();

        // Cek izin dari ROLE
        $rolePermission = DB::table('permissions')
            ->join('roles', 'permissions.role_id', '=', 'roles.id')
            ->join('modules', 'permissions.module_id', '=', 'modules.id')
            ->where('roles.id', $user->role_id)
            ->where('modules.name', $module)
            ->where("permissions.can_$action", true)
            ->exists();

        // Cek izin dari USER PERMISSIONS (Override)
        $userPermission = DB::table('user_permissions')
            ->join('modules', 'user_permissions.module_id', '=', 'modules.id')
            ->where('user_permissions.user_id', $user->id)
            ->where('modules.name', $module)
            ->where("user_permissions.can_$action", true)
            ->exists();

        // Jika tidak punya izin dari role maupun user-specific, tolak akses
        if (!$rolePermission && !$userPermission) {
            return response()->json(['message' => 'Tidak Memiliki Hak Akses'], 403);
        }

        return $next($request);
    }
}
