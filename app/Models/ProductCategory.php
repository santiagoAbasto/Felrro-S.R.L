<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'order',
        'is_active',
        'is_featured',
        'featured_order',
    ];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | 🔥 APPENDS (IMPORTANTE PARA INERTIA)
    |--------------------------------------------------------------------------
    */
    protected $appends = [
        'image_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id')
            ->orderBy('name->es')
            ->orderBy('featured_order');
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Generador de Order (Formato Jefe)
    |--------------------------------------------------------------------------
    */

    public static function nextOrder(): string
    {
        $last = self::orderByDesc('order')->value('order');

        if (!$last) {
            return 'A';
        }

        return self::incrementCustom($last);
    }

    private static function incrementCustom(string $value): string
    {
        if (strlen($value) === 1) {
            return $value . 'A';
        }

        $first = $value[0];
        $second = $value[1];

        if ($second !== 'Z') {
            return $first . chr(ord($second) + 1);
        }

        if ($first !== 'Z') {
            return chr(ord($first) + 1);
        }

        throw new \Exception('Límite máximo de categorías alcanzado (ZZ).');
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Helpers Multilenguaje (Seguros)
    |--------------------------------------------------------------------------
    */

    public function getName(): string
    {
        $locale = app()->getLocale();

        if (!is_array($this->name)) {
            return '';
        }

        return $this->name[$locale]
            ?? $this->name['es']
            ?? '';
    }

    public function getDescription(): ?string
    {
        $locale = app()->getLocale();

        if (!is_array($this->description)) {
            return null;
        }

        return $this->description[$locale]
            ?? $this->description['es']
            ?? null;
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Accessor Imagen (BLINDADO)
    |--------------------------------------------------------------------------
    */

    public function getImageUrlAttribute(): string
    {
        if (!$this->image) {
            return asset('images/default-category.png');
        }

        // Verifica existencia física en storage
        if (!Storage::disk('public')->exists($this->image)) {
            return asset('images/default-category.png');
        }

        return asset('storage/' . $this->image);
    }
}
