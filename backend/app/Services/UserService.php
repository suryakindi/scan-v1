<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Fungsi untuk membuat user baru
     */

    
    public function createUser($data)
    {
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'role_id' => $data['role_id'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'notelp' => $data['notelp'] ?? null,
                'nik' => $data['nik'],
                'nip' => $data['nip'] ?? null,
                'sip' => $data['sip'] ?? null,
                'kode_bpjs' => $data['kode_bpjs'] ?? null,
                'ihs_id' => $data['ihs_id'] ?? null,
                'is_active' => true,
                'cdfix' => $data['cdfix'],
            ]);

            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    //Check Token

    public function checkToken()
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Ambil role permissions
            $rolePermissions = DB::table('permissions')
                ->join('modules', 'permissions.module_id', '=', 'modules.id')
                ->where('permissions.role_id', $user->role_id)
                ->select('modules.name as module', 'permissions.can_view', 'permissions.can_edit', 'permissions.can_create', 'permissions.can_delete')
                ->get();

            // Ambil user override permissions
            $userPermissions = DB::table('user_permissions')
                ->join('modules', 'user_permissions.module_id', '=', 'modules.id')
                ->where('user_permissions.user_id', $user->id)
                ->select('modules.name as module', 'user_permissions.can_view', 'user_permissions.can_edit', 'user_permissions.can_create', 'user_permissions.can_delete')
                ->get();

            return [
                'status' => true,
                'message' => 'Token Valid',
                'data' => [
                    'user' => $user,
                    'role_permissions' => $rolePermissions,
                    'user_permissions' => $userPermissions
                ],
                'code' => 200
            ];
        }

        return [
            'status' => false,
            'message' => 'Token invalid',
            'data' => null,
            'code' => 401
        ];
    }

    //Login User

    public function loginUser($username, $password)
    {
        // Pengecekan Username dan Password
        $user = User::with('roles')->where('username', $username)->where('is_active', true)->first();

        // Jika gagal login
        if (!$user || !Hash::check($password, $user->password)) {
            return [
                'status' => false,
                'message' => 'Gagal Login',
                'data' => null,
                'code' => 401
            ];
        }

        // Jika berhasil, buat token
        $token = $user->createToken('scan')->plainTextToken;
        return [
            'status' => true,
            'message' => 'Login Sukses',
            'data' => [
                'data' => $user,
                'token' => $token
            ],
            'code' => 200
        ];
    }

    /**
     * Fungsi untuk mengupdate user
     */
    public function updateUser($id, $data)
    {
        
        $user = User::find($id);
        if (!$user) {
            return null;
        }

        DB::beginTransaction();
        try {
            $user->update([
                'is_active'=> $data['is_active'] ?? $user->is_active,
                'name' => $data['name'] ?? $user->name,
                'username' => $data['username'] ?? $user->username ,
                'role_id' => $data['role_id'] ?? $user->role_id,
                'email' => $data['email'] ?? $user->email,
                'password' => bcrypt($data['password']) ?? $user->password,
                'notelp' => $data['notelp'] ?? $user->notelp,
                'nik' => $data['nik'] ?? $user->nik,
                'nip' => $data['nip'] ?? $user->nip,
                'sip' => $data['sip'] ?? $user->sip,
                'kode_bpjs' => $data['kode_bpjs'] ?? $user->kode_bpjs,
                'ihs_id' => $data['ihs_id'] ?? $user->ihs_id,
                'cdfix' => $data['cdfix'] ?? $user->cdfix,
            ]);

            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Fungsi untuk menghapus user
     */
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return false;
        }
        DB::beginTransaction();
        try {
            $user->is_active = false;
            $user->save();

            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
