<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductIcon extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
        'order',
        'placement',
        'footer_side',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'image_url',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_icon')
            ->withPivot('order', 'show_in_pdf', 'pdf_group')
            ->withTimestamps()
            ->orderBy('product_icon.order');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image || !Storage::disk('public')->exists($this->image)) {
            return null;
        }

        $absolutePath = Storage::disk('public')->path($this->image);
        $version = is_file($absolutePath) ? filemtime($absolutePath) : $this->updated_at?->timestamp;

        return asset('storage/' . $this->image) . ($version ? '?v=' . $version : '');
    }

    public function getName(): string
    {
        $locale = app()->getLocale();

        return $this->name[$locale] ?? $this->name['es'] ?? '';
    }
}
