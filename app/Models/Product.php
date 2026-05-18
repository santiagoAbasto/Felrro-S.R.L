<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'short_description',
        'description',
        'featured',
        'featured_order',
        'home_order',
        'image',
        'pdf_graphic',
        'pdf_color_table',
        'ficha_tecnica_file',
        'ficha_tecnica_weight',
        'ficha_tecnica_format',
        'is_active'
    ];

    protected $casts = [
        'name'              => 'array',
        'short_description' => 'array',
        'description'       => 'array',
        'featured'          => 'boolean',
        'is_active'         => 'boolean',
        'home_order'        => 'integer',
    ];

    protected $appends = [
        'image_url',
        'pdf_graphic_url',
        'pdf_color_table_url',
        'ficha_tecnica_url'
    ];

    /* =======================================================
       BOOT
    ======================================================= */

    protected static function booted()
    {
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = self::generateUniqueSlug($product->name['es'] ?? '');
            }

            if ($product->featured && empty($product->featured_order)) {
                $product->featured_order = self::nextFeaturedOrder();
            }
        });

        static::updating(function ($product) {

            if ($product->isDirty('name')) {
                $product->slug = self::generateUniqueSlug(
                    $product->name['es'],
                    $product->id
                );
            }

            if ($product->featured && empty($product->featured_order)) {
                $product->featured_order = self::nextFeaturedOrder();
            }

            if (!$product->featured) {
                $product->featured_order = null;
            }
        });
    }

    /* =======================================================
       RELATIONS
    ======================================================= */

    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function specifications()
    {
        return $this->hasMany(ProductSpecification::class)->orderBy('order');
    }

    public function applications()
    {
        return $this->hasMany(ProductApplication::class)->orderBy('order');
    }

    public function technicalSections()
    {
        return $this->hasMany(ProductTechnicalSection::class)->orderBy('order');
    }

    public function icons()
    {
        return $this->belongsToMany(ProductIcon::class, 'product_icon')
            ->withPivot('order', 'show_in_pdf', 'pdf_group')
            ->withTimestamps()
            ->orderBy('product_icon.order');
    }

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function sectors()
    {
        return $this->belongsToMany(Sector::class, 'product_sector')
            ->withTimestamps();
    }

    /* =======================================================
       ACCESSORS
    ======================================================= */
    public function getImageUrlAttribute(): string
    {
        if ($this->image && Storage::disk('public')->exists($this->image)) {
            return asset('storage/' . $this->image);
        }

        return asset('images/placeholders/product.png');
    }

    public function getFichaTecnicaUrlAttribute(): ?string
    {
        if (!$this->ficha_tecnica_file) return null;

        return asset('storage/' . $this->ficha_tecnica_file);
    }

    public function getPdfGraphicUrlAttribute(): ?string
    {
        if (!$this->pdf_graphic || !Storage::disk('public')->exists($this->pdf_graphic)) {
            return null;
        }

        return asset('storage/' . $this->pdf_graphic);
    }

    public function getPdfColorTableUrlAttribute(): ?string
    {
        if (!$this->pdf_color_table || !Storage::disk('public')->exists($this->pdf_color_table)) {
            return null;
        }

        return asset('storage/' . $this->pdf_color_table);
    }

    /* =======================================================
       FEATURED ORDER
    ======================================================= */

    public static function nextFeaturedOrder(): string
    {
        $last = self::where('featured', true)
            ->orderByDesc('featured_order')
            ->value('featured_order');

        if (!$last) return 'A';

        return self::incrementCustom($last);
    }

    private static function incrementCustom(string $value): string
    {
        if (strlen($value) === 1) return $value . 'A';

        $first  = $value[0];
        $second = $value[1];

        if ($second !== 'Z') return $first . chr(ord($second) + 1);

        if ($first !== 'Z') return chr(ord($first) + 1);

        throw new \Exception('Límite máximo alcanzado en productos destacados.');
    }

    /* =======================================================
       SLUG
    ======================================================= */

    public static function generateUniqueSlug(string $name, $ignoreId = null): string
    {
        $slug = self::safeSlug($name);
        $original = $slug;
        $count = 1;

        while (
            static::where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }

    private static function safeSlug(string $value): string
    {
        $normalized = trim($value);

        if ($normalized === '') {
            return 'producto';
        }

        $normalized = strtr($normalized, [
            'Á' => 'A', 'À' => 'A', 'Ä' => 'A', 'Â' => 'A',
            'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a',
            'É' => 'E', 'È' => 'E', 'Ë' => 'E', 'Ê' => 'E',
            'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
            'Í' => 'I', 'Ì' => 'I', 'Ï' => 'I', 'Î' => 'I',
            'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
            'Ó' => 'O', 'Ò' => 'O', 'Ö' => 'O', 'Ô' => 'O',
            'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o',
            'Ú' => 'U', 'Ù' => 'U', 'Ü' => 'U', 'Û' => 'U',
            'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
            'Ñ' => 'N', 'ñ' => 'n',
        ]);

        try {
            $slug = Str::slug($normalized);
        } catch (\Throwable) {
            $slug = '';
        }

        if (!is_string($slug) || trim($slug) === '') {
            $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $normalized);
            $ascii = is_string($ascii) && $ascii !== '' ? $ascii : $normalized;
            $slug = strtolower($ascii);
            $slug = preg_replace('/[^a-z0-9]+/i', '-', $slug) ?? '';
            $slug = trim($slug, '-');
        }

        return $slug !== '' ? $slug : 'producto';
    }

    /* =======================================================
       SCOPES
    ======================================================= */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true)
            ->where('is_active', true)
            ->orderBy('home_order');
    }

    /* =======================================================
       MULTILANG
    ======================================================= */

    public function getName(): string
    {
        $locale = app()->getLocale();
        return $this->name[$locale] ?? $this->name['es'] ?? '';
    }

    public function getShortDescription(): ?string
    {
        $locale = app()->getLocale();
        return $this->short_description[$locale] ?? $this->short_description['es'] ?? null;
    }

    public function getDescription(): ?string
    {
        $locale = app()->getLocale();
        return $this->description[$locale] ?? $this->description['es'] ?? null;
    }
}
