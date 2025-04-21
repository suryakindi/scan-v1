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
        Schema::create('registrasi_detail_layanan_pasiens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_registrasi_pasien');
            $table->unsignedBigInteger('id_ruangan');
            $table->unsignedBigInteger('id_dokter')->nullable();
            $table->string('noantrian');
            $table->string('noantriandokter');
            $table->string('noantrianbpjs')->nullable();
            $table->datetime('tanggal_masuk');
            $table->datetime('tanggal_keluar')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->boolean('is_active')->default(1);
            $table->string('cdfix');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrasi_detail_layanan_pasiens');
    }
};
