<?php

namespace Database\Seeders;

use App\Models\Lokasi\District;
use App\Models\Lokasi\Province;
use App\Models\Lokasi\Regencies;
use App\Models\Lokasi\Village;
use Illuminate\Database\Seeder;

class LokasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Province::truncate();
        Regencies::truncate();
        District::truncate();
        Village::truncate();

        $this->create_provinces();
        $this->create_regencies();
        $this->create_districts();
        $this->create_villages();
    }

    private function create_provinces()
    {
        $filePath = database_path('seeders/lokasi/provinces.json');

        if (!file_exists($filePath)) {
            throw new \Exception("File not found: $filePath");
        }

        Province::truncate();

        $json = file_get_contents($filePath);

        collect(json_decode($json, true))
            ->chunk(500)
            ->each(function ($data) {
                Province::insert($data->toArray());
            });
    }

    private function create_regencies()
    {
        $filePath = database_path('seeders/lokasi/regencies.json');

        if (!file_exists($filePath)) {
            throw new \Exception("File not found: $filePath");
        }

        Regencies::truncate();

        $json = file_get_contents($filePath);

        collect(json_decode($json, true))
            ->chunk(500)
            ->each(function ($data) {
                Regencies::insert($data->toArray());
            });
    }

    private function create_districts()
    {
        $filePath = database_path('seeders/lokasi/districts.json');

        if (!file_exists($filePath)) {
            throw new \Exception("File not found: $filePath");
        }

        District::truncate();

        $json = file_get_contents($filePath);

        collect(json_decode($json, true))
            ->chunk(500)
            ->each(function ($data) {
                District::insert($data->toArray());
            });
    }

    private function create_villages()
    {
        $filePath = database_path('seeders/lokasi/villages.json');

        if (!file_exists($filePath)) {
            throw new \Exception("File not found: $filePath");
        }

        Village::truncate();

        $json = file_get_contents($filePath);

        collect(json_decode($json, true))
            ->chunk(500)
            ->each(function ($data) {
                Village::insert($data->toArray());
            });
    }
}
