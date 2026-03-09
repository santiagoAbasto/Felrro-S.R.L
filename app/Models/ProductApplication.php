<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductApplication extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'product_id',
        'type',        // application | construction | extra
        'title',
        'content',
        'order',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'title'   => 'array',
        'content' => 'array',
        'order'   => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type)->orderBy('order');
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Multilanguage Helpers
    |--------------------------------------------------------------------------
    */

    public function getTitle(): ?string
    {
        if (!$this->title) return null;

        $locale = app()->getLocale();
        return $this->title[$locale] ?? $this->title['es'] ?? null;
    }

    public function getContent(): string
    {
        $locale = app()->getLocale();
        return $this->content[$locale] ?? $this->content['es'] ?? '';
    }
}