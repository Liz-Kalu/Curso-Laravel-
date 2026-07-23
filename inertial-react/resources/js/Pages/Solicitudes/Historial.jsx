import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Eye, Search, History } from 'lucide-react';

const ESTADO_STYLES = {
    'Pendiente':  'bg-amber-50 text-amber-700 border-amber-200',
    'En proceso': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completado': 'bg-green-50 text-green-700 border-green-200',
    'Cancelado':  'bg-red-50 text-red-700 border-red-200',
};

function EstadoBadge({ nombre }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${ESTADO_STYLES[nombre] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {nombre}
        </span>
    );
}

export default function Historial({ solicitudes, estados }) {
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('todos');

    const solicitudesFiltradas = useMemo(() => {
        const term = busqueda.trim().toLowerCase();

        return solicitudes.filter((s) => {
            const coincideTexto = !term ||
                s.folio.toLowerCase().includes(term) ||
                s.departamento_solicitante?.nombre.toLowerCase().includes(term) ||
                s.departamento_destino?.nombre.toLowerCase().includes(term);

            const coincideEstado = estadoFiltro === 'todos' ||
                String(s.id_estado) === estadoFiltro;

            return coincideTexto && coincideEstado;
        });
    }, [busqueda, estadoFiltro, solicitudes]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Historial de Solicitudes</h2>}>
            <Head title="Historial de Solicitudes" />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Historial de Solicitudes</h1>
                        <p className="text-sm text-muted-foreground">
                            {solicitudesFiltradas.length} de {solicitudes.length} solicitudes
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por folio o departamento..."
                                className="pl-8 w-64"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los estados</SelectItem>
                                {estados.map((e) => (
                                    <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    {solicitudesFiltradas.length === 0 && (
                        <div className="rounded-lg border bg-white py-12 text-center text-muted-foreground">
                            <History className="mx-auto mb-2 h-8 w-8 opacity-40" />
                            No se encontraron solicitudes con esos filtros.
                        </div>
                    )}

                    {solicitudesFiltradas.map((sol) => (
                        <div
                            key={sol.id}
                            className="flex flex-wrap items-center gap-4 rounded-lg border border-l-4 border-l-blue-600 bg-white px-4 py-3 shadow-sm"
                        >
                            <div className="min-w-[110px]">
                                <p className="text-xs text-muted-foreground">FOLIO</p>
                                <p className="font-semibold text-blue-700">{sol.folio}</p>
                            </div>

                            <div className="min-w-[160px]">
                                <p className="text-xs text-muted-foreground">DEPTO. SOLICITANTE</p>
                                <p className="text-sm font-medium">{sol.departamento_solicitante?.nombre}</p>
                            </div>

                            <div className="min-w-[160px]">
                                <p className="text-xs text-muted-foreground">DEPTO. DESTINO</p>
                                <p className="text-sm font-medium">{sol.departamento_destino?.nombre}</p>
                            </div>

                            <div className="min-w-[100px]">
                                <p className="text-xs text-muted-foreground">TIPO</p>
                                <p className="text-sm font-medium">{sol.tipo_mantenimiento?.nombre}</p>
                            </div>

                            <div className="min-w-[110px]">
                                <EstadoBadge nombre={sol.estado?.nombre} />
                            </div>

                            <div className="min-w-[100px] text-sm text-muted-foreground">
                                {new Date(sol.fecha_elaboracion).toLocaleDateString('es-MX')}
                            </div>

                            <div className="ml-auto">
                                <Link href={route('solicitudes.show', sol.id)}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="mr-1 h-4 w-4" />
                                        Ver
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
