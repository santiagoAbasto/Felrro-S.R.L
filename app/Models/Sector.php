<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Sector extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'order',       // 🔥 nuevo
        'is_active'
    ];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | 🔥 MULTILENGUAJE HELPERS
    |--------------------------------------------------------------------------
    */

    public function getName(): string
    {
        $locale = app()->getLocale();
        return $this->name[$locale] ?? $this->name['es'] ?? '';
    }

    public function getDescription(): ?string
    {
        $locale = app()->getLocale();
        return $this->description[$locale] ?? $this->description['es'] ?? null;
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 IMAGE ACCESSOR (NO ROMPE STORAGE)
    |--------------------------------------------------------------------------
    */

    public function getImageUrlAttribute(): string
    {
        if (!$this->image) {
            return asset('images/placeholder-sector.jpg');
        }

        return asset('storage/' . $this->image);
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 ELIMINAR IMAGEN SEGURA
    |--------------------------------------------------------------------------
    */

    public function deleteImage(): void
    {
        if ($this->image && Storage::disk('public')->exists($this->image)) {
            Storage::disk('public')->delete($this->image);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 ORDEN EMPRESARIAL A, AA, AB...
    |--------------------------------------------------------------------------
    */

    public static function nextOrder(): string
    {
        $last = self::orderByDesc('order')->value('order');

        if (!$last) {
            return 'A';
        }

        return self::incrementOrder($last);
    }

    protected static function incrementOrder(string $value): string
    {
        $alphabet = range('A', 'Z');
        $chars = str_split($value);
        $i = count($chars) - 1;

        while ($i >= 0) {
            $pos = array_search($chars[$i], $alphabet);

            if ($pos < 25) {
                $chars[$i] = $alphabet[$pos + 1];
                return implode('', $chars);
            }

            $chars[$i] = 'A';
            $i--;
        }

        return 'A' . implode('', $chars);
    }
}