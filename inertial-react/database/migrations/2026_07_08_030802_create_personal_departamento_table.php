<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_departamento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_personal')->constrained('personal', 'id')->cascadeOnDelete();
            $table->foreignId('id_departamento')->constrained('departamentos', 'id')->cascadeOnDelete();
            $table->string('cargo', 100)->nullable();
            $table->date('fecha_asignacion');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique(['id_personal', 'id_departamento']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_departamento');
    }
};
