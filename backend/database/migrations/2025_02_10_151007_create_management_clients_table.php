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
        Schema::create('management_clients', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->boolean('connect_bpjs')->default(false);
            $table->string('nama_client');
            $table->string('notelp')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('website')->nullable();
            $table->text('alamat')->nullable();
            $table->unsignedBigInteger('kelurahan_id')->nullable();
            $table->unsignedBigInteger('kecamatan_id')->nullable();
            $table->unsignedBigInteger('kabupaten_id')->nullable();
            $table->unsignedBigInteger('provinsi_id')->nullable();
            $table->decimal('koordinat1', 10, 8)->nullable();
            $table->decimal('koordinat2', 11, 8)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('management_clients');
    }
};
