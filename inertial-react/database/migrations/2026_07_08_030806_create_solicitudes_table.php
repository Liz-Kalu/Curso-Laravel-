<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->string('folio', 30)->unique();
            $table->date('fecha_elaboracion');
            $table->text('descripcion');

            $table->foreignId('id_departamento_solicitante')->constrained('departamentos', 'id');
            $table->foreignId('id_departamento_destino')->constrained('departamentos', 'id');
            $table->foreignId('id_solicitante')->constrained('personal', 'id');
            $table->foreignId('id_tipo_mantenimiento')->constrained('tipos_mantenimiento', 'id');
            $table->foreignId('id_estado')->constrained('estados', 'id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
