<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('pdf_graphic')->nullable()->after('image');
        });

        Schema::table('product_icon', function (Blueprint $table) {
            $table->boolean('show_in_pdf')->default(true)->after('order');
        });
    }

    public function down(): void
    {
        Schema::table('product_icon', function (Blueprint $table) {
            $table->dropColumn('show_in_pdf');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('pdf_graphic');
        });
    }
};
