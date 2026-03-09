<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Certificate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'format',
        'weight',
        'file',
        'image_logo',
        'order',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Boot
    |--------------------------------------------------------------------------
    */

    protected static function booted()
    {
        static::creating(function ($certificate) {

            // Slug basado en ES
            $baseSlug = Str::slug(
                is_array($certificate->name)
                    ? ($certificate->name['es'] ?? uniqid())
                    : uniqid()
            );

            // Asegurar slug único
            $slug = $baseSlug;
            $counter = 1;

            while (self::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $certificate->slug = $slug;

            // Orden siempre en mayúscula
            $certificate->order = strtoupper($certificate->order ?? '');
        });

        static::updating(function ($certificate) {
            $certificate->order = strtoupper($certificate->order ?? '');
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Multilenguaje Helper
    |--------------------------------------------------------------------------
    */

    public function getNameLocale()
    {
        $locale = app()->getLocale();

        if (!is_array($this->name)) {
            return '';
        }

        return $this->name[$locale]
            ?? $this->name['es']
            ?? '';
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFileUrlAttribute()
    {
        return $this->file
            ? asset('storage/' . $this->file)
            : null;
    }

    public function getImageLogoUrlAttribute()
    {
        return $this->image_logo
            ? asset('storage/' . $this->image_logo)
            : null;
    }
}