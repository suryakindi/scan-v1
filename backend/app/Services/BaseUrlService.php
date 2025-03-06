<?php

namespace App\Services;

use App\Models\BaseUrl;
use Illuminate\Support\Facades\DB;
use Exception;

class BaseUrlService
{
    /**
     * Create a new baseurl.
     *
     * @param array $data
     * @return BaseUrlService
     * @throws Exception
     */

    public function createBaseURL(array $data){
        DB::beginTransaction();
        try {
            $baseurl = BaseUrl::create($data);
            DB::commit();
            return $baseurl;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal membuat baseurl: " . $e->getMessage());
        }
    }

    public function updateBaseURL(BaseUrl $baseUrl, array $data): BaseUrl
    {
        DB::beginTransaction();
        try {
            $baseUrl->update($data);
            DB::commit();
            return $baseUrl;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal memperbarui baseUrl: " . $e->getMessage());
        }
    }

    public function getBaseUrl()
    {
        try {
            $baseUrl = BaseUrl::get();
            return $baseUrl;
        } catch (\Exception $e) {
            throw new Exception("Gagal memperbarui baseUrl: " . $e->getMessage());
        }
       
    }
    
}
