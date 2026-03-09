<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('job_applications', function (Blueprint $table) {

            $table->foreignId('job_position_id')
                ->nullable()
                ->after('position_applied')
                ->constrained('job_positions')
                ->nullOnDelete();

            $table->foreignId('job_sector_id')
                ->nullable()
                ->after('sector')
                ->constrained('job_sectors')
                ->nullOnDelete();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            //
        });
    }
};
