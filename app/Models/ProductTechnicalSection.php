<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductTechnicalSection extends Model
{
    protected $fillable = [
        'product_id',
        'product_import_batch_id',
        'type',
        'title',
        'sheet_name',
        'source_row',
        'order',
    ];

    protected $casts = [
        'title' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function rows()
    {
        return $this->hasMany(ProductTechnicalRow::class)->orderBy('order');
    }

    public function getTitle(): string
    {
        $locale = app()->getLocale();

        return $this->title[$locale] ?? $this->title['es'] ?? '';
    }
}
