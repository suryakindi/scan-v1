<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'username' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'notelp' => '081234567890',
                'nik' => '3201010101010001',
                'nip' => null,
                'sip' => null,
                'kode_bpjs' => null,
                'ihs_id' => null,
                'is_active' => true,
                'cdfix' => 1,
                'role' => 'Administrator',
            ],
            [
                'name' => 'Dokter User',
                'username' => 'dokter',
                'email' => 'dokter@example.com',
                'password' => Hash::make('password123'),
                'notelp' => '081298765432',
                'nik' => '3201010101010002',
                'nip' => '12345678',
                'sip' => 'SIP-98765',
                'kode_bpjs' => 'BPJS12345',
                'ihs_id' => 'IHS-001',
                'is_active' => true,
                'cdfix' => 1,
                'role' => 'Dokter',
            ],
            [
                'name' => 'Perawat User',
                'username' => 'perawat',
                'email' => 'perawat@example.com',
                'password' => Hash::make('password123'),
                'notelp' => '081277788899',
                'nik' => '3201010101010003',
                'nip' => '87654321',
                'sip' => null,
                'kode_bpjs' => 'BPJS54321',
                'ihs_id' => 'IHS-002',
                'is_active' => true,
                'cdfix' => 1,
                'role' => 'Perawat',
            ],
            [
                'name' => 'Kasir User',
                'username' => 'kasir',
                'email' => 'kasir@example.com',
                'password' => Hash::make('password123'),
                'notelp' => '081233344455',
                'nik' => '3201010101010004',
                'nip' => null,
                'sip' => null,
                'kode_bpjs' => null,
                'ihs_id' => null,
                'is_active' => true,
                'cdfix' => 1,
                'role' => 'Kasir',
            ],
        ];

        foreach ($users as $userData) {
            $role = Role::where('name', $userData['role'])->first();

            if ($role) {
                User::firstOrCreate([
                    'email' => $userData['email']
                ], [
                    'name' => $userData['name'],
                    'username' => $userData['username'],
                    'password' => $userData['password'],
                    'notelp' => $userData['notelp'],
                    'nik' => $userData['nik'],
                    'nip' => $userData['nip'],
                    'sip' => $userData['sip'],
                    'kode_bpjs' => $userData['kode_bpjs'],
                    'ihs_id' => $userData['ihs_id'],
                    'is_active' => $userData['is_active'],
                    'cdfix' => $userData['cdfix'],
                    'role_id' => $role->id,
                ]);
            }
        }
    }
}
