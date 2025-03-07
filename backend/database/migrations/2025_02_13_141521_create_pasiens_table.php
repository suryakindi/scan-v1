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
        Schema::create('pasiens', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->string('nama');
            $table->string('norm')->unique();
            $table->string('no_bpjs')->nullable();
            $table->string('ihs_number')->nullable();
            $table->string('nik')->nullable()->unique();
            $table->string('tempatlahir');
            $table->string('tanggal_lahir');
            $table->string('agama');
            $table->string('pendidikan_terakhir');
            $table->string('pekerjaan');
            $table->string('notelp');
            $table->string('nama_bapak');
            $table->string('nama_ibu');
            $table->string('status_perkawinan');
            $table->string('nama_pasangan')->nullable();
            $table->string('golongan_darah');
            $table->unsignedBigInteger('id_alamat_pasien')->nullable();
            
            $table->string('cdfix');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasiens');
    }
};
