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
        Schema::create('master_tindakans', function (Blueprint $table) {
            $table->id();
            $table->string('tindakan');
            $table->float('harga');
            $table->boolean('is_bpjs')->default(0);
            $table->boolean('is_active')->default(1);
            $table->string('kodeexternal')->nullable();
            $table->unsignedBigInteger('cdfix');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->datetime('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_tindakans');
    }
};
