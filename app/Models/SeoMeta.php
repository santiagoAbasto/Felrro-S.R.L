<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SeoMeta extends Model
{
    private const CACHE_PREFIX = 'seo_meta:';

    protected $table = 'seo_meta';

    protected $fillable = [
        'page',
        'title',
        'description',
        'keywords',
        'og_image',
    ];

    protected $appends = [
        'og_image_url',
    ];

    protected static function booted(): void
    {
        static::saved(function (self $meta): void {
            static::forgetCachedValue($meta->page);
        });

        static::deleted(function (self $meta): void {
            static::forgetCachedValue($meta->page);
        });
    }

    public static function rememberByPage(string $page): ?self
    {
        return Cache::rememberForever(
            static::cacheKey($page),
            fn () => static::query()->where('page', $page)->first()
        );
    }

    public function getOgImageUrlAttribute(): ?string
    {
        return $this->og_image
            ? asset('storage/' . $this->og_image)
            : null;
    }

    private static function forgetCachedValue(string $page): void
    {
        Cache::forget(static::cacheKey($page));
    }

    private static function cacheKey(string $page): string
    {
        return static::CACHE_PREFIX . $page;
    }
}
