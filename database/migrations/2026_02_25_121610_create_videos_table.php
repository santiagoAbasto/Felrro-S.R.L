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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();

            // 🔥 MULTILENGUAJE
            $table->json('title');
            $table->json('format')->nullable();
            $table->json('weight')->nullable();

            // 🔒 No traducible
            $table->string('file');
            $table->string('duration')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('page_slug');

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
