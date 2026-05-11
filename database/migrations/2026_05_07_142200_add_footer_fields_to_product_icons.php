<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_icons', function (Blueprint $table) {
            $table->string('placement', 30)->default('icon')->after('order');
            $table->string('footer_side', 20)->nullable()->after('placement');
        });
    }

    public function down(): void
    {
        Schema::table('product_icons', function (Blueprint $table) {
            $table->dropColumn(['placement', 'footer_side']);
        });
    }
};
