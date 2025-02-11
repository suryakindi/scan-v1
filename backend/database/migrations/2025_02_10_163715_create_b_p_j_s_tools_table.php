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
        Schema::create('bpjstools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_client')->constrained('management_clients')->onDelete('cascade');
            $table->string('cons_id')->nullable();
            $table->string('secretkey')->nullable();
            $table->string('provider_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bpjstools');
    }
};
