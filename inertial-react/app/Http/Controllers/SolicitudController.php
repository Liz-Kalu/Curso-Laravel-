<?php

namespace App\Http\Controllers;

use App\Models\Historial;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Solicitud;
use App\Models\Departamento;
use App\Models\Personal;
use App\Models\TipoMantenimiento;
use App\Models\Estado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SolicitudController extends Controller
{
    public function index()
    {
        $personal = $this->personalActual();
        $misDeptos = $this->departamentosActualesIds();

        $miDepartamentoActivo = $personal
            ?->departamentos()
            ->wherePivot('activo', true)
            ->first();

        $solicitudesQuery = Solicitud::with([
            'departamentoSolicitante',
            'departamentoDestino',
            'solicitante',
            'tipoMantenimiento',
            'estado',
            'personalAsignado',
        ]);

        if ($personal) {
            $solicitudesQuery->where(function ($q) use ($personal, $misDeptos) {
                $q->where('id_solicitante', $personal->id)
                    ->orWhereIn('id_departamento_destino', $misDeptos);
            });
        } else {
            $solicitudesQuery->whereRaw('1 = 0');
        }

        $solicitudes = $solicitudesQuery->latest()->get()->map(function ($s) use ($personal, $misDeptos) {
            $encargado = $s->personalAsignado->firstWhere('pivot.estado_asignacion', 'Asignado');

            $yaAsignada = $encargado !== null;

            $esSolicitante = $personal && $s->id_solicitante === $personal->id;
            $esEncargado = $personal && $encargado && $encargado->id === $personal->id;

            $puedeTomar = $personal
                && $misDeptos->contains($s->id_departamento_destino)
                && ! $yaAsignada
                && $s->id_solicitante !== $personal->id;

            return array_merge($s->toArray(), [
                'encargado_nombre' => $encargado?->nombre_completo,
                'puede_tomar' => $puedeTomar,
                'es_solicitante' => $esSolicitante,
                'es_encargado' => $esEncargado,
            ]);
        });

        return Inertia::render('Solicitudes/Index', [
            'solicitudes' => $solicitudes,

            'departamentos' => Departamento::orderBy('nombre')->get(['id', 'nombre']),

            'personal' => Personal::with(['departamentos' => function ($q) {
                $q->where('activo', true)->select('departamentos.id');
            }])
                ->orderBy('nombre')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'nombre_completo' => $p->nombre_completo,
                    'departamentos_ids' => $p->departamentos->pluck('id'),
                ]),

            'tiposMantenimiento' => TipoMantenimiento::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => Estado::orderBy('nombre')->get(['id', 'nombre']),

            'miPersonal' => $personal ? [
                'id' => $personal->id,
                'nombre_completo' => $personal->nombre_completo,
                'departamento_id' => $miDepartamentoActivo?->id,
                'departamento_nombre' => $miDepartamentoActivo?->nombre,
            ] : null,
        ]);
    }

    public function historial()
    {
        $personal = $this->personalActual();
        $misDeptos = $this->departamentosActualesIds();

        $solicitudesQuery = Solicitud::with([
            'departamentoSolicitante',
            'departamentoDestino',
            'solicitante',
            'tipoMantenimiento',
            'estado',
        ]);

        if ($personal) {
            $solicitudesQuery->where(function ($q) use ($personal, $misDeptos) {
                $q->where('id_solicitante', $personal->id)
                    ->orWhereIn('id_departamento_destino', $misDeptos);
            });
        } else {
            $solicitudesQuery->whereRaw('1 = 0');
        }

        return Inertia::render('Solicitudes/Historial', [
            'solicitudes' => $solicitudesQuery->latest()->get(),
            'estados' => Estado::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    public function store(Request $request)
    {
        $personal = $this->personalActual();
        abort_if(! $personal, 403, 'Tu cuenta no está ligada a ningún personal.');

        $miDepartamento = $personal->departamentos()->wherePivot('activo', true)->first();
        abort_if(! $miDepartamento, 403, 'No perteneces a ningún departamento activo.');

        $validated = $request->validate([
            'id_departamento_destino' => ['required', 'exists:departamentos,id'],
            'id_tipo_mantenimiento'   => ['required', 'exists:tipos_mantenimiento,id'],
            'descripcion'             => ['required', 'string'],
        ]);

        $validated['id_departamento_solicitante'] = $miDepartamento->id;
        $validated['id_solicitante'] = $personal->id;
        $validated['fecha_elaboracion'] = now()->toDateString();

        $idEstadoPendiente = Estado::where('nombre', 'Pendiente')->value('id');
        $validated['id_estado'] = $idEstadoPendiente;

        $solicitud = Solicitud::create($validated);

        Historial::create([
            'id_solicitud' => $solicitud->id,
            'id_estado' => $idEstadoPendiente,
            'id_personal' => $personal->id,
            'comentario' => 'Solicitud creada.',
            'fecha' => now(),
        ]);

        return back()->with('status', 'Solicitud creada correctamente.');
    }

    public function update(Request $request, Solicitud $solicitud)
    {
        $personal = $this->personalActual();
        abort_if(! $personal, 403);

        [$esSolicitante, $esEncargado] = $this->rolesSobre($solicitud, $personal);

        abort_unless($esSolicitante || $esEncargado, 403, 'No tienes permiso para editar esta solicitud.');

        if ($esSolicitante) {
            // El solicitante puede cambiar qué pidió, pero no el estado de su propia solicitud.
            $validated = $request->validate([
                'id_departamento_destino' => ['required', 'exists:departamentos,id'],
                'id_tipo_mantenimiento'   => ['required', 'exists:tipos_mantenimiento,id'],
                'descripcion'             => ['required', 'string'],
            ]);
        } else {
            // El encargado solo puede cambiar el estado, no el contenido de la solicitud.
            $validated = $request->validate([
                'id_estado' => ['required', 'exists:estados,id'],
            ]);
        }

        $estadoCambio = isset($validated['id_estado'])
            && $solicitud->id_estado !== (int) $validated['id_estado'];

        $solicitud->update($validated);

        if ($estadoCambio) {
            Historial::create([
                'id_solicitud' => $solicitud->id,
                'id_estado' => $validated['id_estado'],
                'id_personal' => $personal->id,
                'comentario' => 'Estado actualizado manualmente.',
                'fecha' => now(),
            ]);
        }

        return back()->with('status', 'Solicitud actualizada correctamente.');
    }

    public function destroy(Solicitud $solicitud)
    {
        $personal = $this->personalActual();
        abort_if(! $personal, 403);

        [$esSolicitante, $esEncargado] = $this->rolesSobre($solicitud, $personal);

        abort_unless($esSolicitante || $esEncargado, 403, 'No tienes permiso para eliminar esta solicitud.');

        $solicitud->delete();

        return back()->with('status', 'Solicitud eliminada.');
    }

    public function show(Solicitud $solicitud)
    {
        $personal = $this->personalActual();
        $misDeptos = $this->departamentosActualesIds();

        $puedeVer = $personal && (
                $solicitud->id_solicitante === $personal->id ||
                $misDeptos->contains($solicitud->id_departamento_destino)
            );

        abort_unless($puedeVer, 403);

        $solicitud->load([
            'departamentoSolicitante',
            'departamentoDestino',
            'solicitante',
            'tipoMantenimiento',
            'estado',
            'personalAsignado',
        ]);

        $yaAsignada = $solicitud->personalAsignado
            ->contains(fn ($p) => $p->pivot->estado_asignacion === 'Asignado');

        $puedeTomar = $personal
            && $misDeptos->contains($solicitud->id_departamento_destino)
            && ! $yaAsignada
            && $solicitud->id_solicitante !== $personal->id;

        return Inertia::render('Solicitudes/Show', [
            'solicitud' => $solicitud,
            'puedeTomar' => $puedeTomar,
        ]);
    }

    public function tomar(Solicitud $solicitud)
    {
        $personal = $this->personalActual();

        abort_if(! $personal, 403);

        if ($solicitud->id_solicitante === $personal->id) {
            return back()->with('error', 'No puedes tomar tu propia solicitud, aunque pertenezcas al departamento destino.');
        }

        $misDeptos = $this->departamentosActualesIds();
        abort_unless($misDeptos->contains($solicitud->id_departamento_destino), 403);

        $yaAsignada = $solicitud->personalAsignado()
            ->wherePivot('estado_asignacion', 'Asignado')
            ->exists();

        if ($yaAsignada) {
            return back()->with('error', 'Esta solicitud ya fue tomada por alguien más.');
        }

        $solicitud->personalAsignado()->attach($personal->id, [
            'rol' => 'Responsable',
            'estado_asignacion' => 'Asignado',
            'fecha_asignacion' => now(),
        ]);

        $idEstadoEnProceso = Estado::where('nombre', 'En proceso')->value('id');

        $solicitud->update(['id_estado' => $idEstadoEnProceso]);

        Historial::create([
            'id_solicitud' => $solicitud->id,
            'id_estado' => $idEstadoEnProceso,
            'id_personal' => $personal->id,
            'comentario' => 'Solicitud tomada por ' . $personal->nombre_completo,
            'fecha' => now(),
        ]);

        return back()->with('status', 'Has tomado la solicitud.');
    }

    public function imprimir(Solicitud $solicitud)
    {
        $solicitud->load([
            'departamentoSolicitante',
            'departamentoDestino',
            'solicitante',
            'tipoMantenimiento',
            'estado',
        ]);

        $pdf = Pdf::loadView('solicitudes.imprimir', ['solicitud' => $solicitud])
            ->setPaper('letter');

        return $pdf->stream("solicitud-{$solicitud->folio}.pdf");
    }

    /**
     * La persona (Personal) ligada al usuario logueado, o null si no tiene cuenta ligada.
     */
    private function personalActual(): ?\App\Models\Personal
    {
        return auth()->user()->personal;
    }

    /**
     * IDs de los departamentos activos del usuario logueado.
     */
    private function departamentosActualesIds()
    {
        $personal = $this->personalActual();

        if (! $personal) {
            return collect();
        }

        return $personal->departamentos()
            ->wherePivot('activo', true)
            ->pluck('departamentos.id');
    }

    /**
     * Devuelve [esSolicitante, esEncargado] del $personal dado sobre la $solicitud.
     */
    private function rolesSobre(Solicitud $solicitud, Personal $personal): array
    {
        $esSolicitante = $solicitud->id_solicitante === $personal->id;

        $esEncargado = $solicitud->personalAsignado()
            ->wherePivot('estado_asignacion', 'Asignado')
            ->where('personal.id', $personal->id)
            ->exists();

        return [$esSolicitante, $esEncargado];
    }
}
