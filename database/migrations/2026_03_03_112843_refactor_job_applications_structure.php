<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('job_applications', function (Blueprint $table) {

            // RENOMBRE A ESTÁNDAR INGLÉS
            $table->renameColumn('nombre', 'first_name');
            $table->renameColumn('apellido', 'last_name');
            $table->renameColumn('telefono', 'phone');
            $table->renameColumn('tipo_documento', 'document_type');
            $table->renameColumn('numero_documento', 'document_number');
            $table->renameColumn('pais', 'country');
            $table->renameColumn('puesto_aplica', 'position_applied');
            $table->renameColumn('cv_file', 'cv_path');
            $table->renameColumn('carta_presentacion_file', 'cover_letter_path');

            // NUEVOS CAMPOS ENTERPRISE
            $table->boolean('is_reviewed')->default(false)->after('cover_letter_path');
            $table->boolean('is_contacted')->default(false)->after('is_reviewed');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
