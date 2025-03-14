<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterPasienRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_pasien' => 'required|exists:pasiens,id',
            'id_ruangan_asal' => 'required|exists:master_ruangans,id',
            // 'id_ruangan_terakhir' => 'required|exists:master_ruangans,id',
            'id_jenis_kunjungan' => 'required|exists:master_jenis_kunjungans,id',
            'id_jaminan' => 'required|exists:master_jaminans,id',
            'id_tkp' => 'required|exists:master_tkps,id',
            'id_dokter' => 'required|exists:users,id',
            'no_registrasi' => 'required|string|unique:registrasi_pasiens,no_registrasi',
            'tanggal_registrasi' => 'required|date',
            'is_active' => 'boolean',
            'cdfix' => 'required|integer',
            'created_by' => 'nullable|exists:users,id',
            'updated_by' => 'nullable|exists:users,id',
            'deleted_by' => 'nullable|exists:users,id',
        ];
    }
}
