<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historiales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_solicitud')->constrained('solicitudes', 'id')->cascadeOnDelete();
            $table->foreignId('id_estado')->constrained('estados', 'id');
            $table->foreignId('id_personal')->constrained('personal', 'id');
            $table->text('comentario')->nullable();
            $table->dateTime('fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historiales');
    }
};
