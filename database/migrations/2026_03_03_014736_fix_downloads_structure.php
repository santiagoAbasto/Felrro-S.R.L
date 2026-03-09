<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('downloads', function (Blueprint $table) {

            // Cambiar json a string
            $table->string('format')->nullable()->change();
            $table->string('weight')->nullable()->change();

            // Nuevos campos enterprise
            $table->string('slug')->after('name');
            $table->string('order', 10)->nullable()->after('file');
        });
    }

    public function down(): void
    {
        Schema::table('downloads', function (Blueprint $table) {

            $table->json('format')->nullable()->change();
            $table->json('weight')->nullable()->change();

            $table->dropColumn(['slug', 'order']);
        });
    }
};
