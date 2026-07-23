<?php

namespace Database\Seeders;

use App\Models\Departamento;
use App\Models\Estado;
use App\Models\Personal;
use App\Models\Solicitud;
use App\Models\TipoMantenimiento;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Guarda [nombre, usuario, contraseña] para imprimirlas al final.
     */
    private array $credencialesGeneradas = [];

    /**
     * Crea (si no existe ya) la cuenta de acceso ligada a un Personal,
     * generando usuario y contraseña automáticamente.
     */
    private function crearCuenta(Personal $personal, string $password): void
    {
        $existente = User::where('id_personal', $personal->id)->first();

        if ($existente) {
            $this->credencialesGeneradas[] = [
                $personal->nombre_completo,
                $existente->usuario,
                '(ya existía)',
            ];
            return;
        }

        $usuario = $personal->generarUsuarioUnico();

        User::create([
            'id_personal' => $personal->id,
            'name' => $personal->nombre_completo,
            'usuario' => $usuario,
            'email' => $usuario . '@itt.edu.mx',
            'password' => Hash::make($password),
        ]);

        $this->credencialesGeneradas[] = [
            $personal->nombre_completo,
            $usuario,
            $password,
        ];
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Cuenta de prueba genérica (no ligada a Personal)
        User::firstOrCreate(
            ['usuario' => 'test'],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
            ]
        );

        foreach ([
                     ['nombre' => 'Pendiente', 'descripcion' => 'Solicitud registrada, aún sin atender'],
                     ['nombre' => 'En proceso', 'descripcion' => 'Solicitud siendo atendida'],
                     ['nombre' => 'Completado', 'descripcion' => 'Solicitud finalizada correctamente'],
                     ['nombre' => 'Cancelado', 'descripcion' => 'Solicitud cancelada'],
                 ] as $estado) {
            Estado::firstOrCreate(['nombre' => $estado['nombre']], $estado);
        }

        foreach ([
                     ['nombre' => 'Correctivo', 'descripcion' => 'Reparación de una falla existente'],
                     ['nombre' => 'Preventivo', 'descripcion' => 'Mantenimiento programado para evitar fallas'],
                     ['nombre' => 'Predictivo', 'descripcion' => 'Mantenimiento basado en el análisis de condiciones'],
                 ] as $tipo) {
            TipoMantenimiento::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }

        // --- Departamentos ---
        $centroInfo = Departamento::firstOrCreate(['nombre' => 'Centro de Información']);
        $centroComputo = Departamento::firstOrCreate(['nombre' => 'Centro de Cómputo']);
        $rh = Departamento::firstOrCreate(['nombre' => 'Recursos Humanos']);

        // --- Personal existente (ya lo tenías) ---
        $norma = Personal::firstOrCreate([
            'nombre' => 'Norma Natalia',
            'apellido_paterno' => 'Rubín',
            'apellido_materno' => 'Ramírez',
        ]);

        $adriana = Personal::firstOrCreate([
            'nombre' => 'Adriana',
            'apellido_paterno' => 'Ramírez',
            'apellido_materno' => 'Luna',
            'cargo' => 'Ing.',
        ]);

        // --- Personal nuevo: Centro de Cómputo ---
        $juan = Personal::firstOrCreate([
            'nombre' => 'Juan Carlos',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Gómez',
            'cargo' => 'Técnico en Sistemas',
        ]);

        $fernanda = Personal::firstOrCreate([
            'nombre' => 'María Fernanda',
            'apellido_paterno' => 'López',
            'apellido_materno' => 'Torres',
            'cargo' => 'Jefe de Departamento',
        ]);

        // --- Personal nuevo: Recursos Humanos ---
        $luis = Personal::firstOrCreate([
            'nombre' => 'Luis Alberto',
            'apellido_paterno' => 'Hernández',
            'apellido_materno' => 'Cruz',
            'cargo' => 'Analista de RH',
        ]);

        $karime = Personal::firstOrCreate([
            'nombre' => 'Karime Lizbeth',
            'apellido_paterno' => 'Rendon',
            'apellido_materno' => 'Vazquez',
            'cargo' => 'Jefe de Departamento',
        ]);

        // --- Asignación Personal <-> Departamento ---
        $norma->departamentos()->syncWithoutDetaching([
            $centroInfo->id => ['fecha_asignacion' => now(), 'activo' => true],
        ]);

        $adriana->departamentos()->syncWithoutDetaching([
            $centroInfo->id => ['fecha_asignacion' => now(), 'activo' => true],
        ]);

        $juan->departamentos()->syncWithoutDetaching([
            $centroComputo->id => ['fecha_asignacion' => now(), 'activo' => true],
        ]);

        $fernanda->departamentos()->syncWithoutDetaching([
            $centroComputo->id => ['fecha_asignacion' => now(), 'activo' => true],
        ]);

        $luis->departamentos()->syncWithoutDetaching([
            $rh->id => ['fecha_asignacion' => now(), 'activo' => true],
        ]);

        $karime->departamentos()->syncWithoutDetaching([
            $rh->id => ['fecha_asignacion' => now(), 'activo' => true],
        ]);

        // --- Cuentas de acceso (usuario + contraseña generados) ---
        $this->crearCuenta($norma, '1001');
        $this->crearCuenta($adriana, '1002');
        $this->crearCuenta($juan, '1003');
        $this->crearCuenta($fernanda, '1004');
        $this->crearCuenta($luis, '1005');
        $this->crearCuenta($karime, '1006');

        // --- Solicitudes de prueba (folio se genera solo, pero lo forzamos aquí para que coincida con el wireframe) ---
        Solicitud::firstOrCreate(['folio' => 'CC20251-115'], [
            'fecha_elaboracion' => '2025-06-13',
            'id_departamento_solicitante' => $centroInfo->id,
            'id_departamento_destino' => $centroComputo->id,
            'id_solicitante' => $norma->id,
            'id_tipo_mantenimiento' => TipoMantenimiento::where('nombre', 'Correctivo')->value('id'),
            'id_estado' => Estado::where('nombre', 'Completado')->value('id'),
            'descripcion' => 'Cambio de impresoras de lugar y suministro del tóner HP Laserjet P1505.',
        ]);

        Solicitud::firstOrCreate(['folio' => 'CC20252-032'], [
            'fecha_elaboracion' => '2025-06-25',
            'id_departamento_solicitante' => $centroInfo->id,
            'id_departamento_destino' => $centroComputo->id,
            'id_solicitante' => $adriana->id,
            'id_tipo_mantenimiento' => TipoMantenimiento::where('nombre', 'Preventivo')->value('id'),
            'id_estado' => Estado::where('nombre', 'En proceso')->value('id'),
            'descripcion' => 'Mantenimiento preventivo de equipos del laboratorio 3.',
        ]);

        Solicitud::firstOrCreate(['folio' => 'CC20253-078'], [
            'fecha_elaboracion' => '2025-07-02',
            'id_departamento_solicitante' => $rh->id,
            'id_departamento_destino' => $centroComputo->id,
            'id_solicitante' => $norma->id,
            'id_tipo_mantenimiento' => TipoMantenimiento::where('nombre', 'Correctivo')->value('id'),
            'id_estado' => Estado::where('nombre', 'Pendiente')->value('id'),
            'descripcion' => 'Revisión de equipo de cómputo.',
        ]);

        Solicitud::firstOrCreate(['folio' => 'CC20254-091'], [
            'fecha_elaboracion' => '2025-07-08',
            'id_departamento_solicitante' => $rh->id,
            'id_departamento_destino' => $centroComputo->id,
            'id_solicitante' => $norma->id,
            'id_tipo_mantenimiento' => TipoMantenimiento::where('nombre', 'Correctivo')->value('id'),
            'id_estado' => Estado::where('nombre', 'Cancelado')->value('id'),
            'descripcion' => 'Solicitud cancelada por el usuario.',
        ]);

        // --- Imprime las credenciales generadas en la terminal ---
        if ($this->command) {
            $this->command->info('');
            $this->command->info('=== Credenciales generadas ===');
            $this->command->table(
                ['Nombre', 'Usuario', 'Contraseña'],
                $this->credencialesGeneradas
            );
        }
    }
}
