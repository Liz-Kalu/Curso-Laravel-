import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Printer, FileText, UserCheck, UserPlus } from 'lucide-react';

const ESTADO_STYLES = {
    'Pendiente':  'bg-amber-50 text-amber-700 border-amber-200',
    'En proceso': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completado': 'bg-green-50 text-green-700 border-green-200',
    'Cancelado':  'bg-red-50 text-red-700 border-red-200',
};

function EstadoBadge({ nombre }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${ESTADO_STYLES[nombre] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {nombre}
        </span>
    );
}

export default function Show({ solicitud, puedeTomar }) {
    const { post, processing } = useForm();

    const encargado = solicitud.personal_asignado?.find(
        (p) => p.pivot?.estado_asignacion === 'Asignado'
    );

    function tomarSolicitud() {
        post(route('solicitudes.tomar', solicitud.id));
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Detalle de Solicitud</h2>}>
            <Head title={`Solicitud ${solicitud.folio}`} />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-4 flex items-center justify-between">
                    <Link href={route('solicitudes.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Regresar
                        </Button>
                    </Link>

                    <div className="flex gap-2">
                        {puedeTomar && (
                            <Button size="sm" onClick={tomarSolicitud} disabled={processing}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Tomar solicitud
                            </Button>
                        )}

                        <a href={route('solicitudes.imprimir', solicitud.id)} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm">
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">FOLIO</p>
                            <p className="text-lg font-bold text-blue-700">{solicitud.folio}</p>
                            <h1 className="mt-1 flex items-center gap-2 text-xl font-semibold">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Solicitud de Mantenimiento {solicitud.tipo_mantenimiento?.nombre}
                            </h1>
                        </div>
                        <EstadoBadge nombre={solicitud.estado?.nombre} />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Departamento Solicitante</p>
                            <p className="font-medium">{solicitud.departamento_solicitante?.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Departamento Destino</p>
                            <p className="font-medium">{solicitud.departamento_destino?.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Tipo de Mantenimiento</p>
                            <p className="font-medium">{solicitud.tipo_mantenimiento?.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Solicitante</p>
                            <p className="font-medium">{solicitud.solicitante?.nombre_completo}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Fecha de Elaboración</p>
                            <p className="font-medium">
                                {new Date(solicitud.fecha_elaboracion).toLocaleDateString('es-MX')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-md border bg-gray-50 p-4">
                        <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <UserCheck className="h-4 w-4" />
                            ATENDIDO POR
                        </p>
                        {encargado ? (
                            <p className="text-sm font-medium">{encargado.nombre_completo}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aún sin asignar</p>
                        )}
                    </div>

                    <div className="mt-4 rounded-md bg-gray-50 p-4">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Descripción del servicio solicitado</p>
                        <p className="text-sm">{solicitud.descripcion}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
