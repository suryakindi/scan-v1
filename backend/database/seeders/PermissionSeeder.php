<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Module;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'Registrasi',
            'Pasien',
            'Rekam-Medis',
            'BPJS-Tools',
            'Management-Client',
            'Apotek',
            'Laboratorium'
        ];

        $rolesPermissions = [
            'Administrator' => ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => true],
            'Dokter' => ['can_view' => true, 'can_create' => false, 'can_edit' => true, 'can_delete' => false],
            'Perawat' => ['can_view' => true, 'can_create' => true, 'can_edit' => false, 'can_delete' => false],
            'Kasir' => ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false],
        ];

        // Insert Modules
        foreach ($modules as $moduleName) {
            Module::firstOrCreate(['name' => $moduleName]);
        }

        // Assign Permissions to Roles
        foreach ($rolesPermissions as $roleName => $permissions) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                foreach ($modules as $moduleName) {
                    $module = Module::where('name', $moduleName)->first();
                    if ($module) {
                        Permission::firstOrCreate([
                            'role_id' => $role->id,
                            'module_id' => $module->id,
                            'can_view' => $permissions['can_view'],
                            'can_create' => $permissions['can_create'],
                            'can_edit' => $permissions['can_edit'],
                            'can_delete' => $permissions['can_delete'],
                        ]);
                    }
                }
            }
        }
    }
}
