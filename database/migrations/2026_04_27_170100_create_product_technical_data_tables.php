<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_import_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('technical_file')->nullable();
            $table->string('cover_file')->nullable();
            $table->string('status')->default('processed');
            $table->json('summary')->nullable();
            $table->json('errors')->nullable();
            $table->timestamps();
        });

        Schema::create('product_technical_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_import_batch_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type')->default('dimensions');
            $table->json('title');
            $table->string('sheet_name')->nullable();
            $table->integer('source_row')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_technical_rows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_technical_section_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('nominal_section')->nullable();
            $table->string('formation')->nullable();
            $table->string('code')->nullable();
            $table->string('code_pe')->nullable();
            $table->string('code_neutral')->nullable();
            $table->decimal('diameter', 10, 3)->nullable();
            $table->decimal('weight', 12, 3)->nullable();
            $table->json('values')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index('code');
            $table->index('code_pe');
            $table->index('code_neutral');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_technical_rows');
        Schema::dropIfExists('product_technical_sections');
        Schema::dropIfExists('product_import_batches');
    }
};
