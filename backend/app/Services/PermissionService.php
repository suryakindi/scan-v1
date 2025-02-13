<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use App\Models\UserPermission;
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
     
    public function deletePermission($id_permission)
    {
        DB::beginTransaction();
        try {
            $permission = Permission::find($id_permission);
            $permission->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal Hapus : " . $e->getMessage());
        }
    }

    public function createPermissionUser(array $data)
    {
        DB::beginTransaction();
        try {
            $role_user = Auth()->user()->role_id;
            
            // Check if permission already exists for the module and role in Permission model
            $permissionExists = Permission::where('module_id', $data['module_id'])
                                          ->where('role_id', $role_user)
                                          ->first();
            
            if ($permissionExists) {
                
                // Initialize an array to hold the new UserPermission data
                $newData = [
                    'user_id' => $data['user_id'],
                    'module_id' => $data['module_id'],
                    'role_id' => $role_user
                ];
                
                // Set to 'null' if the actions are the same as the existing permission
                // Otherwise, use the provided value in $data
                $newData['can_view'] = ($permissionExists->can_view == $data['can_view']) ? false : $data['can_view'];
                $newData['can_create'] = ($permissionExists->can_create == $data['can_create']) ? false : $data['can_create'];
                $newData['can_edit'] = ($permissionExists->can_edit == $data['can_edit']) ? false : $data['can_edit'];
                $newData['can_delete'] = ($permissionExists->can_delete == $data['can_delete']) ? false : $data['can_delete'];
    
                // Create the new UserPermission if there are any changes
                if (!empty($newData['can_view']) || !empty($newData['can_create']) || !empty($newData['can_edit']) || !empty($newData['can_delete'])) {
                    $userPermission = UserPermission::create($newData);
                    DB::commit();
                    return $userPermission; // Return the newly created UserPermission
                } else {
                    throw new Exception("Tidak ada perubahan pada permission.");
                }
            } else {
                // If no permission exists in the Permission model, create a new UserPermission with the data
                $newData = [
                    'user_id' => $data['user_id'],
                    'module_id' => $data['module_id'],
                    'role_id' => $role_user,
                    'can_view' => $data['can_view'],
                    'can_create' => $data['can_create'],
                    'can_edit' => $data['can_edit'],
                    'can_delete' => $data['can_delete']
                ];
    
                // Create the new UserPermission
                $userPermission = UserPermission::create($newData);
                DB::commit();
                return $userPermission; // Return the newly created UserPermission
            }
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat Permission: " . $e->getMessage());
        }
    }
    


    public function UpdateUserPermissionRole($id_user_permission, array $data)
    {
        DB::beginTransaction();
        try {
            // Cari permission berdasarkan id_user_permission
            $permission = UserPermission::find($id_user_permission);
    
            if (!$permission) {
                throw new Exception("Permission tidak ditemukan dengan ID: " . $id_user_permission);
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

    public function deleteUserPermission($id_user_permission)
    {
        DB::beginTransaction();
        try {
            $permission = UserPermission::find($id_user_permission);
            $permission->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal Hapus : " . $e->getMessage());
        }
    }
    
    public function getUserPermission ($user_id)
    {
        try {
            $permission = UserPermission::where('user_id', $user_id)
                            ->leftjoin('modules', 'modules.id', '=', 'user_permissions.module_id')
                            ->select('user_permissions.*', 'modules.name as nama_modul')
                            ->get();
            return $permission;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Permission: " . $e->getMessage());
        }
    }
}
