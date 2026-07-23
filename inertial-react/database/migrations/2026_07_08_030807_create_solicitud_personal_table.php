<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitud_personal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_solicitud')->constrained('solicitudes', 'id')->cascadeOnDelete();
            $table->foreignId('id_personal')->constrained('personal', 'id')->cascadeOnDelete();
            $table->string('rol', 50)->nullable();
            $table->enum('estado_asignacion', ['Asignado', 'Finalizo', 'Reasignado'])->default('Asignado');
            $table->text('comentario')->nullable();
            $table->dateTime('fecha_asignacion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitud_personal');
    }
};
