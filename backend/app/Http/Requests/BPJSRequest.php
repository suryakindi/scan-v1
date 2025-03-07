<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BPJSRequest extends FormRequest
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
            'id_client'   => 'exists:management_clients,id', 
            'id_base_url' => 'required',
            'service_name' => 'required', 
            'userkey'     => 'required', 
            'username'    => 'required', 
            'password'    => 'required', 
            'cons_id'     => 'required|string|max:255',
            'secretkey'   => 'required|string|max:255',
            'provider_id' => 'required|string|max:255',
        ];
    }

    /**
     * Custom error messages in Indonesian.
     */
    public function messages(): array
    {
        return [
            'id_client.required'   => 'ID Client wajib diisi.',
            'id_client.exists'     => 'ID Client tidak ditemukan dalam database.',
            'service_name.required' => 'Nama layanan wajib diisi.',
            'userkey.required'     => 'Userkey wajib diisi.',
            'id_base_url.required'     => 'BaseURL wajib diisi.',
            'username.required'    => 'Username wajib diisi.',
            'password.required'    => 'Password wajib diisi.',
            'cons_id.string'       => 'Cons ID harus berupa teks.',
            'cons_id.max'          => 'Cons ID maksimal 255 karakter.',
            'secretkey.string'     => 'Secret Key harus berupa teks.',
            'secretkey.max'        => 'Secret Key maksimal 255 karakter.',
            'provider_id.string'   => 'Provider ID harus berupa teks.',
            'provider_id.max'      => 'Provider ID maksimal 255 karakter.',
        ];
    }
}
