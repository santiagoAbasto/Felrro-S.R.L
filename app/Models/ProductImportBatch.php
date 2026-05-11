<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImportBatch extends Model
{
    protected $fillable = [
        'user_id',
        'technical_file',
        'cover_file',
        'status',
        'summary',
        'errors',
    ];

    protected $casts = [
        'summary' => 'array',
        'errors' => 'array',
    ];
}
