<?php

namespace App\Console\Commands;

use App\Models\RegistrasiDetailLayananPasien;
use App\Models\RegistrasiPasien;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BatalRegistrasiService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:batal-registrasi-service';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Membatalkan Pasien Secara Otomatis yang Tidak Dilayani Di Jam 12 Malam';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            DB::beginTransaction(); 
    
            $yesterdayEnd = Carbon::yesterday()->setTime(23, 59, 0); 
            $todayStart = Carbon::today(); 
    
            $RegistrasiPasien = RegistrasiPasien::where('status_pasien', 3)
                ->whereNull('tanggal_pulang')
                ->where('tanggal_registrasi', '<', $todayStart)
                ->get();
    
            foreach ($RegistrasiPasien as $item) {
                $item->is_active = false;
                $item->tanggal_pulang = $yesterdayEnd;
                $item->status_pasien = 10;
                $item->updated_at = now();
                $item->save();
    
                $RegistrasiDetail = RegistrasiDetailLayananPasien::where('id_registrasi_pasien', $item->id)
                    ->whereNull('tanggal_keluar')
                    ->first();
    
                if ($RegistrasiDetail) {
                    $RegistrasiDetail->is_active = false;
                    $RegistrasiDetail->tanggal_keluar = $yesterdayEnd;
                    $RegistrasiDetail->updated_at = now();
                    $RegistrasiDetail->save();
                }
    
                Log::info("✅ Registrasi Pasien ID {$item->id} / {$item->no_registrasi} berhasil dibatalkan.");
            }
    
            DB::commit(); // Commit transaksi kalau semua sukses
    
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback kalau ada error
            Log::error('❌ Gagal membatalkan registrasi pasien: ' . $e->getMessage());
        }
    }
    
}
