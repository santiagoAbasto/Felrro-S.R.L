<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificates', function (Blueprint $table) {

            // Convertir name a JSON
            $table->json('name')->change();

            // Agregar slug único
            $table->string('slug')->unique()->after('name');

            // Agregar orden empresarial tipo Excel
            $table->string('order')->after('image_logo');
        });
    }

    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {

            $table->string('name')->change();

            $table->dropColumn('slug');
            $table->dropColumn('order');
        });
    }
};
