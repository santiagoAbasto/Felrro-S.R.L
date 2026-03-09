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
        'ficha_tecnica_url'
    ];

    /* =======================================================
       BOOT
    ======================================================= */

    protected static function booted()
    {
        static::creating(function ($product) {

            $product->slug = self::generateUniqueSlug($product->name['es']);

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

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
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
        $slug = Str::slug($name);
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
