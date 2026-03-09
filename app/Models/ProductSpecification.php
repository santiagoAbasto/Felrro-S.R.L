<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSpecification extends Model
{
    protected $fillable = [
        'product_id',
        'title',
        'content',
        'order'
    ];

    protected $casts = [
        'title' => 'array',      // 🔥 JSON
        'content' => 'array',    // 🔥 JSON
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 Helpers Multilenguaje
    |--------------------------------------------------------------------------
    */

    public function getTitle(): string
    {
        $locale = app()->getLocale();
        return $this->title[$locale] ?? $this->title['es'] ?? '';
    }

    public function getContent(): string
    {
        $locale = app()->getLocale();
        return $this->content[$locale] ?? $this->content['es'] ?? '';
    }
}