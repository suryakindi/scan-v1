<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceBPJSRequest extends FormRequest
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
            'id_bpjs_tools'   => 'required|exists:bpjstools,id', 
            'service_name' => 'required',
            'id_base_url' => 'required|exists:base_urls,id', 
            'userkey'     => 'required', 
            'username'    => 'nullable', 
            'password'    => 'nullable', 
        ];
    }
}
