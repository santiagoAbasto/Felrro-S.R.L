<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Support\MediaPath;

class Client extends Model
{
    protected $fillable = [
        'name',
        'logo',
        'website',
        'order',
        'is_active'
    ];

    protected $casts = [
        'name' => 'array', // JSON {es,en}
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'logo_url'
    ];

    /*
    |--------------------------------------------------------------------------
    | 🔥 Boot – Normalización Empresarial
    |--------------------------------------------------------------------------
    */

    protected static function booted()
    {
        static::creating(function ($client) {
            $client->order = strtoupper($client->order);
        });

        static::updating(function ($client) {
            $client->order = strtoupper($client->order);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Accessors
    |--------------------------------------------------------------------------
    */

    public function getLogoUrlAttribute(): ?string
    {
        return MediaPath::imageAsset($this->logo, asset('images/logo.png'));
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Helper Multilenguaje Seguro
    |--------------------------------------------------------------------------
    */

    public function getNameAttribute($value)
    {
        return json_decode($value, true);
    }

    public function getNameLocale(): string
    {
        $locale = app()->getLocale();

        return $this->name[$locale]
            ?? $this->name['es']
            ?? '';
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Scopes útiles
    |--------------------------------------------------------------------------
    */

    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy('order');
    }
}
