<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Support\MediaPath;

class PageSectionImage extends Model
{
    protected $fillable = [
        'page_section_id',
        'image',
        'order',
        'title',
        'subtitle',
        'button_text',
        'button_link',
        'video_url',
        'media_type',
    ];

    protected $casts = [
        'title'       => 'array',
        'subtitle'    => 'array',
        'button_text' => 'array',
    ];

    protected $appends = ['image_url'];

    public function section()
    {
        return $this->belongsTo(PageSection::class, 'page_section_id');
    }

    public function getImageUrlAttribute(): string
    {
        return MediaPath::imageAsset($this->image, asset('images/logo.png'));
    }

    public function isVideo(): bool
    {
        return $this->media_type === 'video';
    }

    public function getTitle(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        $data   = $this->title;
        if (empty($data)) return null;
        return $data[$locale] ?? $data['es'] ?? null;
    }

    public function getSubtitle(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        $data   = $this->subtitle;
        if (empty($data)) return null;
        return $data[$locale] ?? $data['es'] ?? null;
    }

    public function getButtonText(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        $data   = $this->button_text;
        if (empty($data)) return null;
        return $data[$locale] ?? $data['es'] ?? null;
    }
}
