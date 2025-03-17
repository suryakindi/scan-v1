<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use DB;
use Illuminate\Support\Facades\Hash;
use App\Services\UserService;
use Exception;
use App\Http\Requests\RegisterUserRequest;

class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function registerUser(RegisterUserRequest $request)
    {
        try {
            $user = $this->userService->createUser($request->validated());
            return $this->baseResponse('Registrasi User Berhasil', null, $user, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat registrasi', $e->getMessage(), null, 500);
        }
    }

    public function updateUser($id, Request $request)
    {
        try {
            $user = $this->userService->updateUser($id, $request->all());
            return $this->baseResponse('Update User Berhasil', null, $user, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat update', $e->getMessage(), null, 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = $this->userService->deleteUser($id);
            return $this->baseResponse('Delete User Berhasil', null, $user, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat delete', $e->getMessage(), null, 500);
        }
    }

    public function loginUser(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $response = $this->userService->loginUser($request->username, $request->password);
    
        return $this->baseResponse($response['message'], null, $response['data'], $response['code']);
    }

    public function logoutUser(Request $request)
    {
        // Revoke (cabut) token yang sedang aktif
        if (Auth::check()) {
            // Cabut (hapus) token saat ini yang sedang digunakan
            $user = Auth::user();
            
            // Jika menggunakan token berbasis Sanctum, kita bisa mencabut token aktif yang digunakan saat ini
            $user->currentAccessToken()->delete(); // Menghapus token aktif milik pengguna saat ini
        }

        
        // Mengembalikan response
        return $this->baseResponse('Logout Berhasil', null, null , 200);
    }
    

    public function checkToken()
    {
        $response = $this->userService->checkToken();
        return $this->baseResponse($response['message'], null, $response['data'], $response['code']);
    }

    public function getUser()
    {
        try {
            $user = $this->userService->getUser();
            return $this->baseResponse('User berhasil Didapatkan', null, $user, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat get user', $e->getMessage(), null, 500);
        }
    }
}
