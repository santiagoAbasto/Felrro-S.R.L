<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Support\MediaPath;

class Post extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'category',
        'title',
        'excerpt',
        'content',
        'slug',
        'image',
        'order',
        'is_featured',
        'is_active',
        'published_at',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'category' => 'array',
        'title' => 'array',
        'excerpt' => 'array',
        'content' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Appended Attributes (IMPORTANT FOR INERTIA)
    |--------------------------------------------------------------------------
    */

    protected $appends = ['image_url'];

    /*
    |--------------------------------------------------------------------------
    | Booted
    |--------------------------------------------------------------------------
    */

    protected static function booted()
    {
        static::creating(function ($post) {

            //  Slug automático
            if (!$post->slug) {
                $post->slug = Str::slug(
                    $post->title['es'] ?? uniqid()
                );
            }

            // 🔥 Order siempre en mayúscula
            if ($post->order) {
                $post->order = strtoupper($post->order);
            }
        });

        static::updating(function ($post) {

            if ($post->order) {
                $post->order = strtoupper($post->order);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopePublished($query)
    {
        return $query
            ->where('is_active', true)
            ->whereNotNull('published_at');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers Multilenguaje
    |--------------------------------------------------------------------------
    */

    public function getTitle(): string
    {
        $locale = app()->getLocale();
        return $this->title[$locale]
            ?? $this->title['es']
            ?? '';
    }

    public function getExcerpt(): string
    {
        $locale = app()->getLocale();
        return $this->excerpt[$locale]
            ?? $this->excerpt['es']
            ?? '';
    }

    public function getContent(): string
    {
        $locale = app()->getLocale();
        return $this->content[$locale]
            ?? $this->content['es']
            ?? '';
    }

    public function getCategory(): string
    {
        $locale = app()->getLocale();
        return $this->category[$locale]
            ?? $this->category['es']
            ?? '';
    }

    /*
    |--------------------------------------------------------------------------
    | IMAGE URL (Soporta public + storage)
    |--------------------------------------------------------------------------
    */

    public function getImageUrlAttribute(): string
    {
        return MediaPath::imageAsset($this->image, asset('images/logo.png'));
    }
}
