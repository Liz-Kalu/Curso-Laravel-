<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoMantenimiento extends Model
{
    public $timestamps = false;

    protected $table = 'tipos_mantenimiento';

    protected $fillable = ['nombre', 'descripcion'];

    public function solicitudes(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'id_tipo_mantenimiento');
    }
}
