<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PersonalDepartamento extends Pivot
{
    protected $table = 'personal_departamento';

    public $incrementing = true;

    protected $fillable = [
        'id_personal',
        'id_departamento',
        'cargo',
        'fecha_asignacion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'fecha_asignacion' => 'date',
            'activo' => 'boolean',
        ];
    }
}
