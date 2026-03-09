<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'meta_title',
        'meta_description',
        'is_active',
    ];

    protected $casts = [
        'title' => 'array',
        'meta_title' => 'array',
        'meta_description' => 'array',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function sections()
    {
        return $this->hasMany(PageSection::class)
            ->where('is_active', true)
            ->orderBy('order');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers Multilenguaje
    |--------------------------------------------------------------------------
    */

    public function getTitle($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->title[$locale] ?? $this->title['es'] ?? null;
    }

    public function getMetaTitle($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->meta_title[$locale] ?? $this->meta_title['es'] ?? null;
    }

    public function getMetaDescription($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->meta_description[$locale] ?? $this->meta_description['es'] ?? null;
    }
}