<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Ubah menjadi true agar bisa digunakan
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_active' => 'nullable|boolean',
            'connect_bpjs' => 'nullable|boolean',
            'nama_client' => 'required|string|max:255',
            'notelp' => 'nullable|string|min:10|max:15|regex:/^[0-9]+$/',
            'email' => 'nullable|email|max:255|unique:management_clients,email',
            'website' => 'nullable|url|max:255',
            'alamat' => 'nullable|string|max:500',
            'kelurahan_id' => 'nullable|integer',
            'kecamatan_id' => 'nullable|integer',
            'kabupaten_id' => 'nullable|integer',
            'provinsi_id' => 'nullable|integer',
            'koordinat1' => 'nullable|numeric|between:-90,90',
            'koordinat2' => 'nullable|numeric|between:-180,180',
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages()
    {
        return [
            'nama_client.required' => 'Nama client wajib diisi.',
            'notelp.regex' => 'Nomor telepon hanya boleh berisi angka.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'website.url' => 'Format URL website tidak valid.',
            'kelurahan_id.exists' => 'Kelurahan tidak ditemukan.',
            'kecamatan_id.exists' => 'Kecamatan tidak ditemukan.',
            'kabupaten_id.exists' => 'Kabupaten tidak ditemukan.',
            'provinsi_id.exists' => 'Provinsi tidak ditemukan.',
            'koordinat1.between' => 'Koordinat 1 harus antara -90 dan 90.',
            'koordinat2.between' => 'Koordinat 2 harus antara -180 dan 180.',
        ];
    }
}
