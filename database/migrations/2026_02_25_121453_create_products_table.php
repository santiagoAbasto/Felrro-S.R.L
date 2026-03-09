<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained('product_categories')
                ->cascadeOnDelete();

            // 🔥 MULTILENGUAJE
            $table->json('name');
            $table->json('short_description')->nullable();
            $table->json('description')->nullable();

            // 🔒 NO traducible
            $table->string('slug')->unique();
            $table->boolean('featured')->default(false);
            $table->string('image')->nullable();

            // 📄 Ficha técnica
            $table->string('ficha_tecnica_file')->nullable();
            $table->string('ficha_tecnica_weight')->nullable();
            $table->string('ficha_tecnica_format')->nullable();

            // ⚙️ Datos técnicos
            $table->string('tension_servicio')->nullable();
            $table->string('temperatura_trabajo')->nullable();
            $table->string('normas')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
