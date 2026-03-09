<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobApplication extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'document_type',
        'document_number',
        'genero',
        'nacionalidad',
        'country',
        'provincia',
        'localidad',
        'fecha_nacimiento',
        'job_position_id',
        'job_sector_id',
        'cv_path',
        'cover_letter_path',
        'is_reviewed',
        'is_contacted',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'is_reviewed' => 'boolean',
        'is_contacted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'full_name',
        'cv_url',
        'cover_letter_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function position()
    {
        return $this->belongsTo(JobPosition::class, 'job_position_id');
    }

    public function sector()
    {
        return $this->belongsTo(JobSector::class, 'job_sector_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getCvUrlAttribute()
    {
        return $this->cv_path
            ? asset("storage/{$this->cv_path}")
            : null;
    }

    public function getCoverLetterUrlAttribute()
    {
        return $this->cover_letter_path
            ? asset("storage/{$this->cover_letter_path}")
            : null;
    }
}