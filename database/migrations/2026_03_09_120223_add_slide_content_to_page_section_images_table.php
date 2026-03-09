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
        Schema::table('page_section_images', function (Blueprint $table) {
            $table->json('title')->nullable()->after('order');
            $table->json('subtitle')->nullable()->after('title');
            $table->json('button_text')->nullable()->after('subtitle');
            $table->string('button_link')->nullable()->after('button_text');
            $table->string('video_url')->nullable()->after('button_link');
            $table->enum('media_type', ['image', 'video'])->default('image')->after('video_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_section_images', function (Blueprint $table) {
            $table->dropColumn(['title', 'subtitle', 'button_text', 'button_link', 'video_url', 'media_type']);
        });
    }
};
