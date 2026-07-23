<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Personal extends Model
{
    use HasFactory;

    protected $table = 'personal';

    protected $fillable = [
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'telefono',
        'cargo',
    ];

    protected $appends = ['nombre_completo'];

    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}");
    }

    /**
     * Departamentos a los que pertenece esta persona (N:M).
     */
    public function departamentos(): BelongsToMany
    {
        return $this->belongsToMany(Departamento::class, 'personal_departamento', 'id_personal', 'id_departamento')
            ->using(PersonalDepartamento::class)
            ->withPivot(['cargo', 'fecha_asignacion', 'activo'])
            ->withTimestamps();
    }

    /**
     * Usuario del sistema asociado a esta persona (si tiene acceso).
     */
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id_personal');
    }

    /**
     * Solicitudes que esta persona ha levantado como solicitante.
     */
    public function solicitudesRealizadas(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'id_solicitante');
    }

    /**
     * Solicitudes que esta persona atiende (N:M vía solicitud_personal).
     */
    public function solicitudesAtendidas(): BelongsToMany
    {
        return $this->belongsToMany(Solicitud::class, 'solicitud_personal', 'id_personal', 'id_solicitud')
            ->using(SolicitudPersonal::class)
            ->withPivot(['rol', 'estado_asignacion', 'comentario', 'fecha_asignacion']);
    }

    /**
     * Genera la base del usuario a partir del nombre completo.
     * Ej: "Karime Lizbeth Rendon Vazquez" -> "kalirendonva"
     */
    public function generarUsuarioBase(): string
    {
        $normalizar = fn (string $texto) => \Illuminate\Support\Str::of($texto)
            ->ascii()
            ->lower()
            ->replace(' ', '')
            ->toString();

        $nombres = preg_split('/\s+/', trim($this->nombre));

        $inicialesNombres = '';
        foreach ($nombres as $n) {
            $inicialesNombres .= mb_substr($normalizar($n), 0, 2);
        }

        $paterno = $normalizar($this->apellido_paterno);

        $materno = $this->apellido_materno
            ? mb_substr($normalizar($this->apellido_materno), 0, 2)
            : '';

        return $inicialesNombres . $paterno . $materno;
    }

    /**
     * Genera un usuario único revisando contra la tabla users.
     * Si ya existe (ej. dos personas con nombres similares), agrega un número:
     * kalirendonva, kalirendonva2, kalirendonva3...
     */
    public function generarUsuarioUnico(): string
    {
        $base = $this->generarUsuarioBase();
        $usuario = $base;
        $contador = 2;

        while (\App\Models\User::where('usuario', $usuario)->exists()) {
            $usuario = $base . $contador;
            $contador++;
        }

        return $usuario;
    }
}
