<?php

namespace Database\Seeders;

use App\Models\StatusPasien;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusPasienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuspasien = [
            'Belum Checkin',
            'Checkin',
            'Belum Dilayani',
            'Dilayani',
            'Selesai',
            'Pulang',
            'Berobat Berjalan',
            'Meninggal',
            'Rujukan',
        ];

        foreach ($statuspasien as $status) {
            StatusPasien::firstOrCreate(['status' => $status]);
        }
    }
}
