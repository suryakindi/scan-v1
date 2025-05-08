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
        Schema::create('master_diagnosa_icd9s', function (Blueprint $table) {
            $table->id();
            $table->string('kode_icd');
            $table->string('nama_icd');
            $table->string('version');
            $table->string('kodeexternal')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_diagnosa_icd9s');
    }
};
