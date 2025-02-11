<?php

namespace App\Http\Controllers;

use App\Models\BaseUrl;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Services\BaseUrlService;

class BaseUrlController extends Controller
{
    protected BaseUrlService $BaseUrlService;

    public function __construct(BaseUrlService $BaseUrlService)
    {
        $this->BaseUrlService = $BaseUrlService;
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'base_url' => 'required|string|url', 
                'kdAplikasi'=>'nullable',
            ]);
            $baseurl = $this->BaseUrlService->createBaseURL($validatedData);
            return $this->baseResponse('BaseURL berhasil dibuat', null, $baseurl, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }

    public function update(Request $request, BaseUrl $id_baseurl): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'base_url' => 'required|string|url', 
                'kdAplikasi'=>'nullable',
            ]);
            $baseUrl = $this->BaseUrlService->updateBaseURL($id_baseurl, $validatedData);
            return $this->baseResponse('BaseURL berhasil diperbarui', null, $baseUrl, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui BaseURL', $e->getMessage(), null, 500);
        }
    }

}
