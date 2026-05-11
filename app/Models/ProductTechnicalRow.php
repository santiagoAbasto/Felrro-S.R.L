<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductTechnicalRow extends Model
{
    protected $fillable = [
        'product_technical_section_id',
        'nominal_section',
        'formation',
        'code',
        'code_pe',
        'code_neutral',
        'diameter',
        'weight',
        'values',
        'order',
    ];

    protected $casts = [
        'values' => 'array',
        'diameter' => 'decimal:3',
        'weight' => 'decimal:3',
    ];

    public function section()
    {
        return $this->belongsTo(ProductTechnicalSection::class, 'product_technical_section_id');
    }
}
