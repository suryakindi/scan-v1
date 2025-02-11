<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Exception;

class PermissionService
{
    /**
     * Create a new baseurl.
     *
     * @param array $data
     * @return PermissionService
     * @throws Exception
     */

    public function createPermissionRole(array $data)
    {
        DB::beginTransaction();
        try {
            // Cek apakah permission sudah ada untuk module_id tertentu
            if (Permission::where('module_id', $data['module_id'])->exists()) {
                throw new Exception("Permission sudah ada untuk module ini!");
            }
    
            // Jika tidak ada, buat permission baru
            $permission = Permission::create($data);
    
            DB::commit();
            return $permission; // Mengembalikan objek permission langsung
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat Permission: " . $e->getMessage());
        }
    }

    public function UpdatePermissionRole($id_permission, array $data)
    {
        DB::beginTransaction();
        try {
            // Cari permission berdasarkan id_permission
            $permission = Permission::find($id_permission);
    
            if (!$permission) {
                throw new Exception("Permission tidak ditemukan dengan ID: " . $id_permission);
            }
    
            // Update permission
            $permission->update($data);
    
            DB::commit();
            return $permission; // Kembalikan objek permission setelah diupdate
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal mengupdate Permission: " . $e->getMessage());
        }
    }

    public function getPermission($role_id)
    {
        try {
         $permission = Permission::where('role_id', $role_id)
                        ->leftjoin('modules', 'modules.id', '=', 'permissions.module_id')
                        ->select('permissions.*', 'modules.name as nama_modul')
                        ->get();
         return $permission;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Permission: " . $e->getMessage());
        }
    }
    
    public function getRole()
    {
        try {
        $role = Role::get();
        return $role;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Role: " . $e->getMessage());
        }
    }

    public function getModul()
    {
        try {
        $modul = Module::get();
        return $modul;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan modul: " . $e->getMessage());
        }
    }
     
    
}
