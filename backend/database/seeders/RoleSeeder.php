<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Administrator',
            'Dokter',
            'Perawat',
            'Rekam Medis',
            'Apotek',
            'Analis Laboratorium',
            'Dinas Kesehatan',
            'Nutritionist',
            'Kader',
            'Kasir',
            'Dinas Catatan Sipil',
            'Pendaftaran',
            'Bidan'
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }
}
