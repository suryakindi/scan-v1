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
        Schema::create('master_ruangans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ruangan');
            $table->unsignedBigInteger('id_departemen');
            $table->boolean('is_active')->default(1);
            $table->string('cdfix');
            $table->string('kodeexternal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_ruangans');
    }
};
