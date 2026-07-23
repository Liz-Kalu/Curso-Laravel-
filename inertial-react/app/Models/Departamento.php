<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departamento extends Model
{
    use HasFactory;

    protected $table = 'departamentos';

    protected $fillable = [
        'nombre',
        'ubicacion',
        'extension',
        'telefono',
    ];

    /**
     * Personal asignado a este departamento (relación N:M vía personal_departamento).
     */
    public function personal(): BelongsToMany
    {
        return $this->belongsToMany(Personal::class, 'personal_departamento', 'id_departamento', 'id_personal')
            ->using(PersonalDepartamento::class)
            ->withPivot(['cargo', 'fecha_asignacion', 'activo'])
            ->withTimestamps();
    }

    /**
     * Solicitudes en las que este departamento es el solicitante.
     */
    public function solicitudesEnviadas(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'id_departamento_solicitante');
    }

    /**
     * Solicitudes dirigidas a este departamento.
     */
    public function solicitudesRecibidas(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'id_departamento_destino');
    }
}
