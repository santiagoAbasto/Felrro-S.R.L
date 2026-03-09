<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value'
    ];

    protected $casts = [
        'value' => 'array', // 🔥 JSON multilenguaje
    ];

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
        $setting = static::where('key', $key)->first();

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
        $setting = static::where('key', $key)->first();

        if (!$setting) {
            return null;
        }

        return $setting->value; // gracias al cast devuelve array
    }
}
