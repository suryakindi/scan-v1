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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('notelp');
            $table->string('nik')->unique();
            $table->string('nip')->nullable();
            $table->string('sip')->nullable();
            $table->string('kode_bpjs')->nullable();
            $table->string('ihs_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('cdfix');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
