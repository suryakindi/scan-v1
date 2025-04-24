<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterKesadaran;

class MasterKesadaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'kesadaran' => 'Compos mentis',
                'kodeexternal' => '01',
            ],
            [
                'kesadaran' => 'Somnolence',
                'kodeexternal' => '02',
            ],
            [
                'kesadaran' => 'Sopor',
                'kodeexternal' => '03',
            ],
            [
                'kesadaran' => 'Coma',
                'kodeexternal' => '04',
            ],
        ];

        foreach ($data as $item) {
            MasterKesadaran::create([
                'kesadaran' => $item['kesadaran'],
                'kodeexternal' => $item['kodeexternal'],
                'is_active' => true,
                'cdfix' => 1,
                'created_by' => 1,
            ]);
        }
    }
}
