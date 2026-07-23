<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Solicitud extends Model
{
    use HasFactory;

    protected $table = 'solicitudes';

    protected $fillable = [
        'folio',
        'fecha_elaboracion',
        'descripcion',
        'id_departamento_solicitante',
        'id_departamento_destino',
        'id_solicitante',
        'id_tipo_mantenimiento',
        'id_estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_elaboracion' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Solicitud $solicitud) {
            if (empty($solicitud->folio)) {
                $solicitud->folio = self::generarFolio();
            }
        });
    }

    /**
     * Genera un folio único con el formato CC{año}{consecutivo del año}-{consecutivo global}.
     * Ejemplo: CC20256-143
     *
     * Ajusta este formato libremente si tu institución maneja otro estándar.
     */
    public static function generarFolio(): string
    {
        $anio = now()->format('Y');
        $consecutivoAnio = self::whereYear('fecha_elaboracion', now()->year)->count() + 1;
        $consecutivoGlobal = self::count() + 1;

        return sprintf('CC%s%d-%03d', $anio, $consecutivoAnio, $consecutivoGlobal);
    }

    public function departamentoSolicitante(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'id_departamento_solicitante');
    }

    public function departamentoDestino(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'id_departamento_destino');
    }

    public function solicitante(): BelongsTo
    {
        return $this->belongsTo(Personal::class, 'id_solicitante');
    }

    public function tipoMantenimiento(): BelongsTo
    {
        return $this->belongsTo(TipoMantenimiento::class, 'id_tipo_mantenimiento');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }

    /**
     * Personas que atienden esta solicitud (N:M).
     */
    public function personalAsignado(): BelongsToMany
    {
        return $this->belongsToMany(Personal::class, 'solicitud_personal', 'id_solicitud', 'id_personal')
            ->using(SolicitudPersonal::class)
            ->withPivot(['rol', 'estado_asignacion', 'comentario', 'fecha_asignacion']);
    }

    public function historial(): HasMany
    {
        return $this->hasMany(Historial::class, 'id_solicitud')->latest('fecha');
    }
}
