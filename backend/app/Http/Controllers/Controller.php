<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected function baseResponse(string $message, $detailError, $data = null, int $statusCode = 200): JsonResponse
    {
        $processedError = env('APP_DEBUG', false) ? $detailError : 'Production Level';
        $isDebug = env('APP_DEBUG', false);
        $env_conf = 'dev';

        if (!$isDebug && $data !== null) {
            $data = $this->encryptAES($data); // Gunakan AES untuk enkripsi
            $env_conf = 'prod';
        }

        $response = [
            'status' => $statusCode < 400 ? 'success' : 'error',
            'message' => $message,
            'detailError' => $processedError,
            'data' => $data,
            'config' => $env_conf
        ];

        return response()->json($response, $statusCode);
    }

    // Fungsi Enkripsi AES-256-CBC
    protected function encryptAES($data)
    {
        $key = substr(hash('sha256', 'scandigital'), 0, 32); // Kunci AES dari "scandigital"
        $iv = substr(hash('sha256', 'scandigital'), 0, 16);  // IV dari "scandigital"

        $encrypted = openssl_encrypt(json_encode($data), 'AES-256-CBC', $key, 0, $iv);
        return base64_encode($encrypted); // Encode ke Base64 agar aman dikirim
    }
}
