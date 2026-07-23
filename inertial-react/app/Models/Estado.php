<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    public $timestamps = false;

    protected $table = 'estados';

    protected $fillable = ['nombre', 'descripcion'];

    public function solicitudes(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'id_estado');
    }
}
