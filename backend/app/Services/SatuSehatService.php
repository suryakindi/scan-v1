<?php

namespace App\Services;

use App\Models\BaseUrl;
use App\Models\SatuSehatTools;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Exception;
use Illuminate\Support\Facades\Hash;

class SatuSehatService
{
    
    public function createSatuSehat(array $data)
    {
        DB::beginTransaction();
        try {
            $satusehat = SatuSehatTools::create($data);
            DB::commit();
            return $satusehat;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function editSatuSehat(SatuSehatTools $id_satusehat, array $data): SatuSehatTools
    {
        DB::beginTransaction();
        try {
            $id_satusehat->update($data);
            DB::commit();
            return $id_satusehat;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal memperbarui id_satusehat: " . $e->getMessage());
        }
    }

    public function deleteSatuSehat(SatuSehatTools $id_satusehat): SatuSehatTools
    {
        DB::beginTransaction();
        try {
            $id_satusehat->update(['is_active' => false]);
            DB::commit();
            return $id_satusehat;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal menghapus id_satusehat: " . $e->getMessage());
        }
    }

    public function getSatuSehatCredentials($cdfix)
    {
        
        $satusehat = SatuSehatTools::where('cdfix', $cdfix)
                                    ->where('is_active', true)
                                    ->first();
        
        if (!$satusehat) {
            throw new Exception("SatuSehat credentials tidak ditemukan atau tidak aktif.");
        }else{
            $baseurl = BaseUrl::find($satusehat->id_base_url);
        }
       
        return [
            'satusehat_server'=>$satusehat->status,
            'baseurl'=>$baseurl->base_url ?? null,
            'client_key' => $satusehat->client_key,
            'secret_key' => $satusehat->secret_key,
        ];
    }

    public function getTokenAccess($credentials)
    {
        $client = new Client();

        $url = $credentials['baseurl'].'/oauth2/v1/accesstoken?grant_type=client_credentials';
      
        $formParams = [
            // 'grant_type' => 'client_credentials',
            'client_id' => $credentials['client_key'], 
            'client_secret' => $credentials['secret_key']
        ];
        $headers = [
            'Content-Type' => 'application/x-www-form-urlencoded'
        ];

        try {
            $response = $client->post($url, [
                'headers' => $headers,
                'body'    => http_build_query($formParams) 
            ]);
            $body = json_decode($response->getBody()->getContents(), true);
            return $body;
        } catch (\Exception $e) {
            throw $e;
        }

    }

  

    public function getIhsPatientByNik($key, $nik)
    {
        $token = $key['access_token'];
    
        try {
            $client = new Client();
    
            // Encode `|` agar tidak bermasalah dalam URL
            $encodedNik = urlencode("https://fhir.kemkes.go.id/id/nik|$nik");
            
            $url = "https://api-satusehat.kemkes.go.id/fhir-r4/v1/Patient?identifier=$encodedNik";
    
            $response = $client->get($url, [
                'headers' => [
                    'Authorization' => "Bearer $token",
                    'Accept'        => 'application/json'
                ],
            ]);
    
            $body = json_decode($response->getBody(), true);
            return $body;
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw $e;
        }
    }
    
}
