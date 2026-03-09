<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSector extends Model
{
    protected $fillable = [
        'name',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}