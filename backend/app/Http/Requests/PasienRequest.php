<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PasienRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'norm' => 'nullable',
            'is_active' => 'boolean',
            'nama' => 'required|string|max:255',
            'no_bpjs' => 'nullable|string|max:255',
            'nik' => 'nullable|string|max:255',
            'tempatlahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'agama' => 'required|string|max:255',
            'pendidikan_terakhir' => 'required|string|max:255',
            'pekerjaan' => 'required|string|max:255',
            'notelp' => 'required|string|max:15',
            'nama_bapak' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'status_perkawinan' => 'required|string|max:255',
            'nama_pasangan' => 'nullable|string|max:255',
            'golongan_darah' => 'required|string|max:5',
            // 'id_alamat_pasien' => 'required|integer|exists:alamat_pasiens,id',
            'cdfix' => 'required|string|max:255',
            
      
            
           
        ];
    }
}
