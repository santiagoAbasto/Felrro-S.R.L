<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_applications', function (Blueprint $table) {
            $table->string('type')->after('product_id'); 
            // application | construction | extra

            $table->json('title')->nullable()->after('type');

            $table->integer('order')
                  ->default(0)
                  ->after('content');
        });
    }

    public function down(): void
    {
        Schema::table('product_applications', function (Blueprint $table) {
            $table->dropColumn(['type', 'title', 'order']);
        });
    }
};