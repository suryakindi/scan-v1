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
        Schema::create('registrasi_pasiens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pasien');
            $table->unsignedBigInteger('id_ruangan_asal');  
            $table->unsignedBigInteger('id_ruangan_terakhir');
            $table->unsignedBigInteger('id_jenis_kunjungan');
            $table->unsignedBigInteger('id_jaminan');
            $table->unsignedBigInteger('id_tkp');
            $table->unsignedBigInteger('id_dokter')->nullable();
            $table->string('no_registrasi');
            $table->datetime('tanggal_registrasi');
            $table->datetime('tanggal_pulang')->nullable();
            $table->boolean('is_active')->default(1);
            $table->unsignedBigInteger('cdfix');
            $table->unsignedBigInteger('status_pasien');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrasi_pasiens');
    }
};
