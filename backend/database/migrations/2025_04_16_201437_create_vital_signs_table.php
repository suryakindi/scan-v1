<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vital_signs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_registrasi_pasien');
            $table->unsignedBigInteger('cdfix');
            $table->string('no_registrasi')->nullable();
            $table->string('tekanan_darah')->nullable();
            $table->string('temperature')->nullable();
            $table->string('nadi')->nullable();
            $table->string('pernafasan')->nullable();
            $table->string('berat_badan')->nullable();
            $table->string('tinggi_badan')->nullable();
            $table->string('lingkar_kepala')->nullable();
            $table->string('lingkar_perut')->nullable();
            $table->string('lingkar_lengan')->nullable();
            $table->string('cara_ukur')->nullable();
            $table->string('kesadaran')->nullable();
            $table->boolean('is_active')->default(1);
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
        Schema::dropIfExists('vital_signs');
    }
};
