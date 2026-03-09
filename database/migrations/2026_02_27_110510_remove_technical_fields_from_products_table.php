<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'normas',
                'tension_servicio',
                'temperatura_trabajo'
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('normas')->nullable();
            $table->string('tension_servicio')->nullable();
            $table->string('temperatura_trabajo')->nullable();
        });
    }
};