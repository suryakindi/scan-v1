<?php

namespace App\Http\Controllers;

use App\Services\PermissionService;
use Illuminate\Http\Request;
use Exception;

class PermissionController extends Controller
{


    protected PermissionService $PermissionService;

    public function __construct(PermissionService $PermissionService)
    {
        $this->PermissionService = $PermissionService;
    }
    public function createPermissionRole(Request $request)
    {
        
        try {
            $Permission = $this->PermissionService->createPermissionRole($request->all());   
            return $this->baseResponse('Permission berhasil dibuat', null, $Permission, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat Membuat Permission', $e->getMessage(), null, 500);
        }
       
    }

    public function UpdatePermissionRole(Request $request, $id_permission)
    {
        try {
            // Kirim id_permission ke service bersama dengan data request
            $permission = $this->PermissionService->UpdatePermissionRole($id_permission, $request->all());
    
            return $this->baseResponse('Permission berhasil diupdate', null, $permission, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat update Permission', $e->getMessage(), null, 500);
        }
    }

    public function getPermission ($role_id)
    {
        try {
            // Kirim id_permission ke service bersama dengan data request
            $permission = $this->PermissionService->getPermission($role_id);
    
            return $this->baseResponse('Permission berhasil Didapatkan', null, $permission, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat get Permission', $e->getMessage(), null, 500);
        }
    }

    public function getModul()
    {
        try {
            // Kirim id_permission ke service bersama dengan data request
            $modul = $this->PermissionService->getModul();
    
            return $this->baseResponse('modul berhasil Didapatkan', null, $modul, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat get modul', $e->getMessage(), null, 500);
        }
    }
    public function getRole ()
    {
        try {
            // Kirim id_permission ke service bersama dengan data request
            $Role = $this->PermissionService->getRole();
    
            return $this->baseResponse('Role berhasil Didapatkan', null, $Role, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat get Role', $e->getMessage(), null, 500);
        }
    }
    

}
