<?php

namespace App\Services;

use App\Models\ManagementClient;
use Illuminate\Support\Facades\DB;
use Exception;

class ManagementClientService
{
    /**
     * Create a new client.
     *
     * @param array $data
     * @return ManagementClient
     * @throws Exception
     */

    public function getAll(){
        try {
            $client = ManagementClient::where('is_active', TRUE)->paginate(100);
            return $client;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Client: " . $e->getMessage());
        }
    }
    public function getById(ManagementClient $client){
        try {
            return $client;
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan Client: " . $e->getMessage());
        }
    }

    public function createClient(array $data): ManagementClient
    {
        DB::beginTransaction();
        try {
            $client = ManagementClient::create($data);
            DB::commit();
            return $client;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat client: " . $e->getMessage());
        }
    }

    /**
     * Update an existing client.
     *
     * @param ManagementClient $client
     * @param array $data
     * @return ManagementClient
     * @throws Exception
     */
    public function updateClient(ManagementClient $client, array $data): ManagementClient
    {
        DB::beginTransaction();
        try {
            $client->update($data);
            DB::commit();
            return $client;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal memperbarui client: " . $e->getMessage());
        }
    }

    /**
     * Soft delete client by setting is_active to false.
     *
     * @param ManagementClient $client
     * @return ManagementClient
     * @throws Exception
     */
    public function deleteClient(ManagementClient $client): ManagementClient
    {
        DB::beginTransaction();
        try {
            $client->update(['is_active' => false]);
            DB::commit();
            return $client;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal menghapus client: " . $e->getMessage());
        }
    }
}
