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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('email');
            $table->string('telefono');
            $table->string('tipo_documento');
            $table->string('numero_documento');
            $table->string('genero')->nullable();
            $table->string('nacionalidad');
            $table->string('pais');
            $table->string('provincia');
            $table->string('localidad');
            $table->date('fecha_nacimiento');
            $table->string('puesto_aplica');
            $table->string('sector');
            $table->string('cv_file');
            $table->string('carta_presentacion_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
