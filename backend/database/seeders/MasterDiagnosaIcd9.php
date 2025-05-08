<?php

namespace Database\Seeders;

use App\Models\MasterDiagnosaIcd9 as ModelsMasterDiagnosaIcd9;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterDiagnosaIcd9 extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $filePath = database_path('seeders/icd9.json');

        if (!file_exists($filePath)) {
            throw new \Exception("File not found: $filePath");
        }

        $json = file_get_contents($filePath);

        collect(json_decode($json, true))
            ->chunk(500)
            ->each(function ($data) {
                ModelsMasterDiagnosaIcd9::insert($data->toArray());
            });

    }
}
