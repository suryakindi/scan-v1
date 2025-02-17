<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SatuSehatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Set ke true agar bisa digunakan
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // 'is_active' => 'required|boolean',
            'kode_fayankes' => 'required|string|max:255',
            'organization_id' => 'required|string|max:255',
            'client_key' => 'required|string|max:255',
            'secret_key' => 'required|string|max:255',
            'id_base_url' => 'required|max:255',
            'cdfix' => 'required|string|max:255',
        ];
    }

    /**
     * Custom error messages (opsional).
     */
    public function messages()
    {
        return [
            'is_active.required' => 'Status aktif wajib diisi.',
            'is_active.boolean' => 'Status aktif harus bernilai true atau false.',
            'kode_fayankes.required' => 'Kode fasyankes wajib diisi.',
            'organization_id.required' => 'Organization ID wajib diisi.',
            'client_key.required' => 'Client Key wajib diisi.',
            'secret_key.required' => 'Secret Key wajib diisi.',
            'cdfix.required' => 'CDFix wajib diisi.',
        ];
    }
}
