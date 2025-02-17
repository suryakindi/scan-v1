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
        Schema::create('satu_sehat_tools', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(1);
            $table->string('id_base_url');
            $table->string('kode_fayankes');
            $table->string('organization_id');
            $table->string('client_key');
            $table->string('secret_key');
            $table->string('status')->default('dev');
            $table->string('cdfix');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('satu_sehat_tools');
    }
};
