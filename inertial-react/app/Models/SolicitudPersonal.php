<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SolicitudPersonal extends Pivot
{
    public $timestamps = false;

    protected $table = 'solicitud_personal';

    public $incrementing = true;

    protected $fillable = [
        'id_solicitud',
        'id_personal',
        'rol',
        'estado_asignacion',
        'comentario',
        'fecha_asignacion',
    ];

    protected function casts(): array
    {
        return [
            'fecha_asignacion' => 'datetime',
        ];
    }
}
