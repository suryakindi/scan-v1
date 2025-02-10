<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class RegisterUserRequest extends FormRequest
{
    /**
     * Menentukan apakah user diizinkan membuat request ini.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk registrasi user.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'role_id' => 'required|exists:roles,id',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'notelp' => 'nullable|string|max:20',
            'nik' => 'required|string|max:20|unique:users,nik',
            'nip' => 'nullable|string|max:20',
            'sip' => 'nullable|string|max:20',
            'kode_bpjs' => 'nullable|string|max:50',
            'ihs_id' => 'nullable|string|max:50',
            'cdfix' => 'required|integer',
        ];
    }
}
