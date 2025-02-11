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
        Schema::create('setting_service_names', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_bpjs_tools');
            $table->string('service_name');
            $table->unsignedBigInteger('id_base_url');
            $table->string('userkey');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->foreign('id_bpjs_tools')->references('id')->on('bpjstools')->onDelete('cascade');
            $table->foreign('id_base_url')->references('id')->on('base_urls')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_service_names');
    }
};
