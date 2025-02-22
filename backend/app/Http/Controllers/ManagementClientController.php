<?php

namespace App\Http\Controllers;

use App\Http\Requests\{ClientRequest,ClientUpdateRequest };

use App\Models\ManagementClient;
use App\Services\ManagementClientService;
use Exception;
use Illuminate\Http\JsonResponse;

class ManagementClientController extends Controller
{
    protected ManagementClientService $managementClientService;

    public function __construct(ManagementClientService $managementClientService)
    {
        $this->managementClientService = $managementClientService;
    }

    /**
     * Store a newly created client.
     */

    public function getAll(){
        try {
            $getClient = $this->managementClientService->getAll();
            return $this->baseResponse('Client berhasil Didapatkan', null, $getClient, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }
    
    public function GetById(ManagementClient $client){
        
        try {
            $getClient = $this->managementClientService->getById($client);
            return $this->baseResponse('Client berhasil Didapatkan', null, $getClient, 200);
        } catch (\Exception $e) {
            return $this->baseResponse('Terjadi kesalahan', $e->getMessage(), null, 500);
        }
    }
    public function create(ClientRequest $request): JsonResponse
    {
        try {
            $client = $this->managementClientService->createClient($request->validated());
            return $this->baseResponse('Client berhasil dibuat', null, $client, 201);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat registrasi', $e->getMessage(), null, 500);
        }
    }

    /**
     * Update an existing client.
     */
    public function update(ClientUpdateRequest $request, ManagementClient $client): JsonResponse
    {
        try {
            $updatedClient = $this->managementClientService->updateClient($client, $request->validated());
            return $this->baseResponse('Client berhasil diperbarui', null, $updatedClient, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat memperbarui client', $e->getMessage(), null, 500);
        }
    }

    /**
     * Soft delete a client (set is_active to false).
     */
    public function delete(ManagementClient $client): JsonResponse
    {
        
        try {
            $updatedClient = $this->managementClientService->deleteClient($client);
            return $this->baseResponse('Client berhasil dinonaktifkan', null, $updatedClient, 200);
        } catch (Exception $e) {
            return $this->baseResponse('Terjadi kesalahan saat menghapus client', $e->getMessage(), null, 500);
        }
    }
}
