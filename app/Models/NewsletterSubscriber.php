<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'email',
        'unsubscribe_token',
        'is_active',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $subscriber) {
            if (blank($subscriber->unsubscribe_token)) {
                $subscriber->unsubscribe_token = static::generateUnsubscribeToken();
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function ensureUnsubscribeToken(): string
    {
        if (filled($this->unsubscribe_token)) {
            return $this->unsubscribe_token;
        }

        $this->forceFill([
            'unsubscribe_token' => static::generateUnsubscribeToken(),
        ])->save();

        return $this->unsubscribe_token;
    }

    public function markSubscribed(): void
    {
        $this->forceFill([
            'is_active' => true,
            'subscribed_at' => now(),
            'unsubscribed_at' => null,
            'unsubscribe_token' => $this->unsubscribe_token ?: static::generateUnsubscribeToken(),
        ])->save();
    }

    public function markUnsubscribed(): void
    {
        $this->forceFill([
            'is_active' => false,
            'unsubscribed_at' => now(),
            'unsubscribe_token' => $this->unsubscribe_token ?: static::generateUnsubscribeToken(),
        ])->save();
    }

    public static function generateUnsubscribeToken(): string
    {
        return Str::random(40);
    }
}
