<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    private const CACHE_PREFIX = 'site_setting:';

    protected $fillable = [
        'key',
        'value'
    ];

    protected $casts = [
        'value' => 'array', // 🔥 JSON multilenguaje
    ];

    protected static function booted(): void
    {
        static::saved(function (self $setting): void {
            static::forgetCachedValue($setting->key);
        });

        static::deleted(function (self $setting): void {
            static::forgetCachedValue($setting->key);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Helper Multilenguaje
    |--------------------------------------------------------------------------
    */

    public function getValue(): ?string
    {
        if (!is_array($this->value)) {
            return $this->value;
        }

        $locale = app()->getLocale();

        return $this->value[$locale] ?? $this->value['es'] ?? null;
    }


    /*
    |--------------------------------------------------------------------------
    | 🔥 Helper estático para obtener setting por key
    |--------------------------------------------------------------------------
    */

    public static function get(string $key): ?string
    {
        $setting = static::rememberSetting($key);

        if (!$setting) {
            return null;
        }

        return $setting->getValue();
    }

    /*
|--------------------------------------------------------------------------
| 🔥 Obtener JSON completo (sin multilenguaje automático)
|--------------------------------------------------------------------------
*/

    public static function getRaw(string $key): ?array
    {
        $setting = static::rememberSetting($key);

        if (!$setting) {
            return null;
        }

        return $setting->value; // gracias al cast devuelve array
    }

    private static function rememberSetting(string $key): ?self
    {
        return Cache::rememberForever(
            static::cacheKey($key),
            fn () => static::query()->where('key', $key)->first()
        );
    }

    private static function forgetCachedValue(string $key): void
    {
        Cache::forget(static::cacheKey($key));
    }

    private static function cacheKey(string $key): string
    {
        return static::CACHE_PREFIX . $key;
    }
}
