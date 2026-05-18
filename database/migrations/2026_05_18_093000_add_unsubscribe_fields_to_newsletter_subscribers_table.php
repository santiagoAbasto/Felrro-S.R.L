<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->string('unsubscribe_token', 64)->nullable()->unique()->after('email');
            $table->timestamp('unsubscribed_at')->nullable()->after('subscribed_at');
        });

        DB::table('newsletter_subscribers')
            ->whereNull('unsubscribe_token')
            ->orderBy('id')
            ->chunkById(100, function ($subscribers) {
                foreach ($subscribers as $subscriber) {
                    DB::table('newsletter_subscribers')
                        ->where('id', $subscriber->id)
                        ->update([
                            'unsubscribe_token' => Str::random(40),
                            'unsubscribed_at' => $subscriber->is_active ? null : now(),
                        ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropUnique(['unsubscribe_token']);
            $table->dropColumn(['unsubscribe_token', 'unsubscribed_at']);
        });
    }
};
