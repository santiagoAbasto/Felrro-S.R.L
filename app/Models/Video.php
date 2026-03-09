<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Video extends Model
{
    protected $fillable = [
        'title',
        'file',
        'format',
        'weight',
        'duration',
        'thumbnail',
        'page_slug',
        'is_active'
    ];

    protected $casts = [
        'title' => 'array',     // 🔥 JSON
        'format' => 'array',    // 🔥 JSON
        'weight' => 'array',    // 🔥 JSON
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | 🔥 Helpers Multilenguaje
    |--------------------------------------------------------------------------
    */

    public function getTitle(): string
    {
        $locale = app()->getLocale();
        return $this->title[$locale] ?? $this->title['es'] ?? '';
    }

    public function getFormat(): ?string
    {
        $locale = app()->getLocale();
        return $this->format[$locale] ?? $this->format['es'] ?? null;
    }

    public function getWeight(): ?string
    {
        $locale = app()->getLocale();
        return $this->weight[$locale] ?? $this->weight['es'] ?? null;
    }

    /*
    |--------------------------------------------------------------------------
    | Scope útil
    |--------------------------------------------------------------------------
    */

    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }
}