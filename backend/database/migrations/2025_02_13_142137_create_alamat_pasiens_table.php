<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alamat_pasiens', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('id_pasien')->nullable();
            $table->string('alamat');
            $table->string('rt');
            $table->string('rw');
            $table->string('id_kelurahan');
            $table->string('id_kecamatan');
            $table->string('id_kabupaten');
            $table->string('id_provinsi');
            $table->unsignedBigInteger('cdfix');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alamat_pasiens');
    }
};
