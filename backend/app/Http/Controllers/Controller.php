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
      

        $response = [
            'status' => $statusCode < 400 ? 'success' : 'error',
            'message' => $message,
            'detailError' => $processedError,
            'data' => $data,
        ];

        return response()->json($response, $statusCode);
    }

  
}
