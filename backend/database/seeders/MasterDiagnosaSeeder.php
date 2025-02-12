<?php

namespace Database\Seeders;

use App\Models\MasterDiagnosa;
use Illuminate\Database\Seeder;

class MasterDiagnosaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filePath = database_path('seeders/master_diagnosa.json');

        if (!file_exists($filePath)) {
            throw new \Exception("File not found: $filePath");
        }

        $json = file_get_contents($filePath);

        collect(json_decode($json, true))
            ->chunk(500)
            ->each(function ($data) {
                MasterDiagnosa::insert($data->toArray());
            });

    }
}
