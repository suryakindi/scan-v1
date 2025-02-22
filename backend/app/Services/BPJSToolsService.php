<?php

namespace App\Services;

use App\Models\BPJSTools;
use App\Models\MasterDepartemen;
use App\Models\MasterRuangan;
use App\Models\SettingServiceName;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Http\JsonResponse;

use GuzzleHttp\Client;

class BPJSToolsService
{
    /**
     * Create a new baseurl.
     *
     * @param array $data
     * @return BaseUrlService
     * @throws Exception
     */
  
    protected $cons_id;
    protected $secretKey;
    protected $kdaplikasi = null;
    protected $userkey = null;
    protected $pcare_username = null;
    protected $pcare_password = null;
    protected $timestamp = null;
    
    

    public function DecryptResponse($value){
        $bahan = $value['response'];
        
        $key = $this->cons_id.$this->secretKey.$this->timestamp;
        
        $encrypt_method = 'AES-256-CBC';
        $key_hash = hex2bin(hash('sha256', $key));
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);
        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);
        $decompress = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = json_decode($decompress);
    
        // Cek apakah 'metaData' ada di dalam array $value
        if (isset($value['metaData'])) {
            return response()->json([
                'data' => $result,
                'metaData' => $value['metaData']
            ]);
        } else {
            return response()->json($result);
        }
    }
    

    public function SetUpHeader($id_client, $service_name)
    {
        $set = $this->getBPJSToolsById($id_client);

        $this->cons_id = $set['bpjs_tools']['cons_id'];
        $this->secretKey = $set['bpjs_tools']['secretkey'];
        foreach ($set['service_name'] as $key => $item) {
            if($item['service_name'] == $service_name){
                $this->userkey = $item['userkey'];
                $this->pcare_username = $item['username'];
                $this->pcare_password = $item['password'];
                $this->kdaplikasi = $item['kdAplikasi'];
                break;
            }
        }

        return $this->HeaderTools();
    }

    public function HeaderTools()
    {
        date_default_timezone_set('UTC');
      
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $datasig = $this->cons_id . '&' . $tStamp;
    
        $signature = hash_hmac('sha256', $datasig, $this->secretKey, true);
        $encodedSignature = base64_encode($signature);
        $encodedAuthorization = base64_encode($this->pcare_username . ':' . $this->pcare_password . ':' . $this->kdaplikasi);
        $this->timestamp = $tStamp;
        $header = [
            "X-cons-id" => $this->cons_id,
            "X-signature" => $encodedSignature,
            "X-timestamp" => $tStamp,
            "X-authorization"  => "Basic $encodedAuthorization",
            "user_key" => $this->userkey
        ];
    
        return $header;
    }

    public function createBPJSTool($id_client ,array $data){
        DB::beginTransaction();
        try {
            $bpjstools = BPJSTools::create([
                'id_client' => $data['id_client'],
                'cons_id'=>$data['cons_id'],
                'secretkey'=>$data['secretkey'],
                'provider_id'=>$data['provider_id'],
            ]);
            $servicename = SettingServiceName::create([
                'id_bpjs_tools'=>$bpjstools->id,
                'service_name'=>$data['service_name'],
                'id_base_url'=>$data['id_base_url'],
                'userkey'=>$data['userkey'],
                'username'=>$data['username'],
                'password'=>$data['password'],
            ]);
            DB::commit();
            
            return $data = [
                'bpjstools' =>$bpjstools,
                'servicename' =>$servicename
            ];
        } catch (\Exception $e) {
            throw new Exception("Gagal create BPJSTools: " . $e->getMessage());
        }
       
    }


    public function getBPJSToolsById($id_client){
        try {
            $bpjstools = BPJSTools::where('id_client', $id_client)->first();
            $servicename = SettingServiceName::where('id_bpjs_tools', $bpjstools->id)
            ->leftjoin('base_urls', 'base_urls.id', '=', 'setting_service_names.id_base_url')
            ->select('setting_service_names.service_name', 'setting_service_names.userkey', 'setting_service_names.username', 'setting_service_names.password', 'base_urls.base_url', 'base_urls.kdAplikasi')
            ->get();
            return [
                'bpjs_tools'=>$bpjstools,
                'service_name'=>$servicename
            ];
        } catch (\Exception $e) {
            throw new Exception("Gagal Mendapatkan BPJSTools: " . $e->getMessage());
        }
    }

    public function updateBPJSTool($id_client, array $data)
    {
        DB::beginTransaction();
        try {
            // Cari data BPJS Tools berdasarkan id_client
            $bpjstools = BPJSTools::where('id_client', $id_client)->first();
            if (!$bpjstools) {
                throw new Exception("BPJS Tools dengan ID Client $id_client tidak ditemukan.");
            }

            // Update BPJS Tools
            $bpjstools->update([
                'cons_id'     => $data['cons_id'] ?? $bpjstools->cons_id,
                'secretkey'   => $data['secretkey'] ?? $bpjstools->secretkey,
                'provider_id' => $data['provider_id'] ?? $bpjstools->provider_id,
            ]);

            // Update SettingServiceName jika ada
            $servicename = SettingServiceName::where('id_bpjs_tools', $bpjstools->id)->first();
            if ($servicename) {
                $servicename->update([
                    'service_name' => $data['service_name'] ?? $servicename->service_name,
                    'id_base_url'  => $data['id_base_url'] ?? $servicename->id_base_url,
                    'userkey'      => $data['userkey'] ?? $servicename->userkey,
                    'username'     => $data['username'] ?? $servicename->username,
                    'password'     => $data['password'] ?? $servicename->password,
                ]);
            }

            DB::commit();

            return [
                'bpjstools' => $bpjstools,
                'servicename' => $servicename
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw new Exception("Gagal update BPJSTools: " . $e->getMessage());
        }
    }

    public function getDokterBPJS($id_client, array $data, $service_name)
    {
        $start = 0;
        $end = 100;
        $base_url = null;
        $set = $this->getBPJSToolsById($id_client);

        if(isset($data['start']) && isset($data['end'])){
                    $start = $data['start'];
                    $end = $data['end'];
        }   
        foreach ($set['service_name'] as $key => $item) {
            if($item['service_name'] == 'pcare-rest'){
                $base_url = $item['base_url'] . '/dokter/' . $start . '/' . $end;
                break;
            }
        }
        if (!$base_url) {
            return response()->json(['error' => 'Base URL untuk PCare tidak ditemukan'], 400);
        }
        $headers = $this->SetUpHeader($id_client, $service_name);
        
        $connect = new \GuzzleHttp\Client();
        try {
            $response = $connect->get($base_url, [
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                    'X-cons-id' => $this->cons_id,
                    'X-signature' => $headers['X-signature'],
                    'X-timestamp' => $headers['X-timestamp'],
                    'X-authorization' => $headers['X-authorization'],
                    'user_key' => $headers['user_key'],
                ],
                'timeout' => 10, // Set timeout 10 detik
            
            ]);
    
            $statusCode = $response->getStatusCode();
            $body = $response->getBody();
            $responseData = json_decode($body, true);
         
            // return $responseData;
            return $this->DecryptResponse($responseData);
            
    
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    
    }

    public function getPesertaByBPJS($id_client, array $data, $service_name)
    {
        $jeniskartu = ($data['jeniskartu'] == 'nik') ? 'nik' : 'noka';
        $nomorkartu = $data['nokartu'];
        $headers = $this->SetUpHeader($id_client, $service_name);
        $set = $this->getBPJSToolsById($id_client);
        $kdProvider = null;
        $base_url = null;

        foreach ($set['service_name'] as $item) {
            if ($item['service_name'] == 'pcare-rest') {
                $kdProvider = $item['kdAplikasi'];
                $base_url = $item['base_url'] . '/peserta/' . $jeniskartu . '/' . $nomorkartu;
                break;
            }
        }

        if (!$base_url) {
            return response()->json(['error' => 'Base URL untuk PCare tidak ditemukan'], 400);
        }

        $connect = new \GuzzleHttp\Client();

        try {
            $response = $connect->get($base_url, [
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                    'X-cons-id' => $this->cons_id,
                    'X-signature' => $headers['X-signature'],
                    'X-timestamp' => $headers['X-timestamp'],
                    'X-authorization' => $headers['X-authorization'],
                    'user_key' => $headers['user_key'],
                ],
                'timeout' => 10, // Set timeout 10 detik
            ]);

            $statusCode = $response->getStatusCode();
            $body = $response->getBody();
            $responseData = json_decode($body, true);

            $results = $this->DecryptResponse($responseData);

            
            if ($results instanceof \Illuminate\Http\JsonResponse) {
                $results = json_decode($results->getContent(), true);
            }

            if (isset($results['data']['kdProviderPst']['kdProvider']) && $results['data']['kdProviderPst']['kdProvider'] !== $kdProvider) {
                $results['warning'] = 'Provider peserta tidak sesuai';
            }

            return response()->json($results);

        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createServiceBPJS(BPJSTools $id_bpjs_tools, array $data)
    {
        DB::beginTransaction();
        try {
            $service_bpjs = SettingServiceName::create($data);
            DB::commit();
            return $service_bpjs;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function updateServiceBPJSById(SettingServiceName $id_service_bpjs, array $data)
    {
        DB::beginTransaction();
        try {
            $id_service_bpjs->update($data);
            DB::commit();
            return $id_service_bpjs;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getPoliAntrean($id_client, $data, $service_name)
    {
        $set = $this->getBPJSToolsById($id_client);
        $tanggal = $data['tanggal'];
        foreach ($set['service_name'] as $key => $item) {
            if($item['service_name'] == 'antreanfktp'){
                $base_url = $item['base_url'] . '/ref/poli/tanggal/'.$tanggal;
                break;
            }
        }
        if (!$base_url) {
            return response()->json(['error' => 'Base URL untuk PCare tidak ditemukan'], 400);
        }
        $headers = $this->SetUpHeader($id_client, $service_name);
        // return $base_url;
        // return $headers;
        $connect = new \GuzzleHttp\Client();
        try {
            $response = $connect->get($base_url, [
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                    'X-cons-id' => $this->cons_id,
                    'X-signature' => $headers['X-signature'],
                    'X-timestamp' => $headers['X-timestamp'],
                    'user_key' => $headers['user_key'],
                ],
                'timeout' => 10, // Set timeout 10 detik
            
            ]);
    
            $statusCode = $response->getStatusCode();
            $body = $response->getBody();
            $responseData = json_decode($body, true);
         
            // return $responseData;
            return $this->DecryptResponse($responseData);
            
    
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getKunjunganBPJS($id_client, array $data, $service_name)
    {
        $set = $this->getBPJSToolsById($id_client);
        $nokartu = $data['no_bpjs'];
        foreach ($set['service_name'] as $key => $item) {
            if($item['service_name'] == $service_name){
                $base_url = $item['base_url'] . '/kunjungan/peserta/'.$nokartu;
                break;
            }
        }
        if (!$base_url) {
            return response()->json(['error' => 'Base URL untuk PCare tidak ditemukan'], 400);
        }
        $headers = $this->SetUpHeader($id_client, $service_name);
        
        $connect = new \GuzzleHttp\Client();
        try {
            $response = $connect->get($base_url, [
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                    'X-cons-id' => $this->cons_id,
                    'X-signature' => $headers['X-signature'],
                    'X-timestamp' => $headers['X-timestamp'],
                    'X-authorization' => $headers['X-authorization'],
                    'user_key' => $headers['user_key'],
                ],
                'timeout' => 10, // Set timeout 10 detik
            
            ]);
    
            $statusCode = $response->getStatusCode();
            $body = $response->getBody();
            $responseData = json_decode($body, true);
         
            // return $responseData;
            return $this->DecryptResponse($responseData);
            
    
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getPoliReferensi($id_client, array $data, $service_name)
    {
        $set = $this->getBPJSToolsById($id_client);
        $row = $data['row'] ?? 1;
        $limit = $data['limit'] ?? 100;
        foreach ($set['service_name'] as $key => $item) {
            if($item['service_name'] == $service_name){
                $base_url = $item['base_url'] . '/poli/fktp/'.$row.'/'.$limit;
                break;
            }
        }
        if (!$base_url) {
            return response()->json(['error' => 'Base URL untuk PCare tidak ditemukan'], 400);
        }
        $headers = $this->SetUpHeader($id_client, $service_name);
        $connect = new \GuzzleHttp\Client();
        try {
            $response = $connect->get($base_url, [
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                    'X-cons-id' => $this->cons_id,
                    'X-signature' => $headers['X-signature'],
                    'X-timestamp' => $headers['X-timestamp'],
                    'X-authorization' => $headers['X-authorization'],
                    'user_key' => $headers['user_key'],
                ],
                'timeout' => 10, // Set timeout 10 detik
            
            ]);
    
            $statusCode = $response->getStatusCode();
            $body = $response->getBody();
            $responseData = json_decode($body, true);
         
            // return $responseData;
            return $this->DecryptResponse($responseData);
            
    
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    public function sinkronisasiPoli($id_client, $service_name)
    {
        $ruangan = MasterRuangan::where('cdfix', $id_client)
                    ->where('is_active', true)
                    ->get();

        // Mencari Departemen dengan nama_departemen "Rawat Jalan" secara case-insensitive
        $departemen = MasterDepartemen::whereRaw("LOWER(nama_departemen) ILIKE LOWER(?)", ['Rawat Jalan'])->first();

        if (!$departemen) {
            throw new Exception('Departemen "Rawat Jalan" tidak ditemukan');
        }

        if ($ruangan->isNotEmpty()) {
            return 'Data Ruangan Sudah Ada!';
        }

        // Ambil data dari BPJS
        $getpoliBpjs = $this->getPoliReferensi($id_client, ['row' => 1, 'limit' => 100], $service_name);
        $decodedResponse = $getpoliBpjs->getData(true);

        // Pastikan list poli ada dalam response
        if (!isset($decodedResponse['data']['list']) || empty($decodedResponse['data']['list'])) {
            throw new Exception('Data Poli BPJS tidak tersedia');
        }

        $listPoli = $decodedResponse['data']['list'];
        DB::beginTransaction();
        try {
            foreach ($listPoli as $list) {
                if($list['poliSakit'] == true){
                    MasterRuangan::create([
                        'nama_ruangan'  => $list['nmPoli'],
                        'kodeexternal'  => $list['kdPoli'],
                        'id_departemen' => $departemen->id,
                        'cdfix'         => $id_client,
                    ]);
                }
                
            }
            DB::commit();
            return response()->json(['success' => 'Sinkronisasi Poli BPJS berhasil'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            throw new Exception('Terjadi kesalahan saat sinkronisasi');
        }
    }



    
}
