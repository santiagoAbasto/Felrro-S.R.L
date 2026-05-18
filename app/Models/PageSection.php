<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Support\MediaPath;

class PageSection extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'page_id',
        'type',
        'title',
        'subtitle',
        'content',
        'button_text',
        'image',
        'button_link',
        'order',
        'is_active',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'title'       => 'array',
        'subtitle'    => 'array',
        'content'     => 'array',
        'button_text' => 'array',
        'is_active'   => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function images()
    {
        return $this->hasMany(PageSectionImage::class)
            ->orderBy('order');
    }

    /*
    |--------------------------------------------------------------------------
    | Traducción interna segura
    |--------------------------------------------------------------------------
    */

    protected function translateField(string $field, $locale = null)
    {
        $locale = $locale ?? app()->getLocale();

        $value = $this->{$field};

        if (!is_array($value) || empty($value)) {
            return null;
        }

        return $value[$locale]
            ?? $value['es']
            ?? null;
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers públicos multilenguaje
    |--------------------------------------------------------------------------
    */

    public function getTitle($locale = null)
    {
        return $this->translateField('title', $locale);
    }

    public function getSubtitle($locale = null)
    {
        return $this->translateField('subtitle', $locale);
    }

    /**
     * getContent inteligente:
     * - Si es multilenguaje → traduce
     * - Si es estructura compleja (video, metrics, etc.) → devuelve array completo
     * - Si es texto simple → devuelve string
     */
    public function getContent($locale = null)
    {
        $value = $this->content;

        if (!is_array($value)) {
            return $value;
        }

        // Si parece estructura multilenguaje
        if (array_key_exists('es', $value) || array_key_exists('en', $value)) {
            return $this->translateField('content', $locale);
        }

        // Si es estructura compleja (video, metrics, values, etc.)
        return $value;
    }

    public function getButtonText($locale = null)
    {
        return $this->translateField('button_text', $locale);
    }

    /*
    |--------------------------------------------------------------------------
    | Imagen segura (helper opcional)
    |--------------------------------------------------------------------------
    */

    public function getImageUrlAttribute()
    {
        return MediaPath::imageAsset($this->image);
    }

    /*
    |--------------------------------------------------------------------------
    | Contenido separado por párrafos
    |--------------------------------------------------------------------------
    */

    public function getContentParagraphs($locale = null): array
    {
        $content = $this->getContent($locale);

        if (!is_string($content) || empty($content)) {
            return [];
        }

        // Normalizar saltos de línea
        $content = str_replace(["\r\n", "\r"], "\n", $content);

        // Separar por doble salto
        $paragraphs = preg_split("/\n{2,}/", $content);

        return array_values(
            array_filter(
                array_map('trim', $paragraphs)
            )
        );
    }
}
