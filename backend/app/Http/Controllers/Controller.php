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
            $data = base64_encode(json_encode($data) . '$c4n'); // Konversi ke JSON sebelum Base64
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
    
}
