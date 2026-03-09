<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Download extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'format',
        'weight',
        'file',
        'order',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($download) {

            $download->slug = Str::slug(
                $download->name['es'] ?? uniqid()
            );

            $download->order = strtoupper($download->order);
        });

        static::updating(function ($download) {
            $download->order = strtoupper($download->order);
        });
    }

    /* ===============================
       URL Accessor
    =============================== */

    public function getFileUrlAttribute()
    {
        return $this->file
            ? asset('storage/' . $this->file)
            : null;
    }

    /* ===============================
       Multilenguaje
    =============================== */

    public function getNameLocale()
    {
        $locale = app()->getLocale();
        return $this->name[$locale] ?? $this->name['es'] ?? '';
    }
}