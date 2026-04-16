<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoMeta extends Model
{
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

    public function getOgImageUrlAttribute(): ?string
    {
        return $this->og_image
            ? asset('storage/' . $this->og_image)
            : null;
    }
}
