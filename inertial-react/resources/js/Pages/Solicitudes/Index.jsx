import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import {
    Plus, Pencil, Trash2, Eye, Printer, Search, FileText, ClipboardList,
    UserPlus,
} from 'lucide-react';

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

export default function Index({ solicitudes, departamentos, personal, tiposMantenimiento, estados, miPersonal }) {
    const [busqueda, setBusqueda] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        fecha_elaboracion: '',
        id_departamento_solicitante: '',
        id_departamento_destino: '',
        id_solicitante: '',
        id_tipo_mantenimiento: '',
        id_estado: '',
        descripcion: '',
    });

    const { delete: destroy, processing: deletingProcessing } = useForm();
    const { post: postTomar, processing: tomarProcessing } = useForm();

    const personalFiltrado = useMemo(() => {
        if (!data.id_departamento_solicitante) return [];
        return personal.filter(p =>
            p.departamentos_ids.includes(Number(data.id_departamento_solicitante))
        );
    }, [data.id_departamento_solicitante, personal]);

    const solicitudesFiltradas = useMemo(() => {
        const term = busqueda.trim().toLowerCase();
        if (!term) return solicitudes;
        return solicitudes.filter(s =>
            s.folio.toLowerCase().includes(term) ||
            s.departamento_solicitante?.nombre.toLowerCase().includes(term) ||
            s.departamento_destino?.nombre.toLowerCase().includes(term)
        );
    }, [busqueda, solicitudes]);

    // ¿Qué campos puede editar el usuario actual en el modal?
    // Al crear, todo es editable normalmente. Al editar:
    // - el solicitante puede cambiar destino/tipo/descripción, pero no el estado.
    // - el encargado solo puede cambiar el estado.
    const puedeEditarContenido = !editing || editing.es_solicitante;
    const puedeEditarEstado = editing && editing.es_encargado;

    function openCreate() {
        reset();
        setEditing(null);
        setData({
            fecha_elaboracion: new Date().toISOString().slice(0, 10),
            id_departamento_solicitante: miPersonal?.departamento_id ? String(miPersonal.departamento_id) : '',
            id_departamento_destino: '',
            id_solicitante: miPersonal?.id ? String(miPersonal.id) : '',
            id_tipo_mantenimiento: '',
            id_estado: '',
            descripcion: '',
        });
        setOpenForm(true);
    }

    function openEdit(sol) {
        setEditing(sol);
        setData({
            fecha_elaboracion: sol.fecha_elaboracion,
            id_departamento_solicitante: String(sol.id_departamento_solicitante),
            id_departamento_destino: String(sol.id_departamento_destino),
            id_solicitante: String(sol.id_solicitante),
            id_tipo_mantenimiento: String(sol.id_tipo_mantenimiento),
            id_estado: String(sol.id_estado),
            descripcion: sol.descripcion ?? '',
        });
        setOpenForm(true);
    }

    function submit(e) {
        e.preventDefault();
        if (editing) {
            put(route('solicitudes.update', editing.id), {
                onSuccess: () => setOpenForm(false),
            });
        } else {
            post(route('solicitudes.store'), {
                onSuccess: () => setOpenForm(false),
            });
        }
    }

    function confirmDelete(sol) {
        setDeleting(sol);
        setOpenDelete(true);
    }

    function doDelete() {
        destroy(route('solicitudes.destroy', deleting.id), {
            onSuccess: () => setOpenDelete(false),
        });
    }

    function tomarSolicitud(sol) {
        postTomar(route('solicitudes.tomar', sol.id));
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Solicitudes de Mantenimiento</h2>}>
            <Head title="Solicitudes de Mantenimiento" />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Solicitudes de Mantenimiento</h1>
                        <p className="text-sm text-muted-foreground">
                            {solicitudes.length} solicitudes registradas
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
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Crear solicitud
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {solicitudesFiltradas.length === 0 && (
                        <div className="rounded-lg border bg-white py-12 text-center text-muted-foreground">
                            <ClipboardList className="mx-auto mb-2 h-8 w-8 opacity-40" />
                            No hay solicitudes registradas.
                        </div>
                    )}

                    {solicitudesFiltradas.map((sol) => (
                        <div
                            key={sol.id}
                            className="flex items-center gap-3 rounded-lg border border-l-4 border-l-blue-600 bg-white px-4 py-3 shadow-sm"
                        >
                            <div className="w-28 shrink-0">
                                <p className="text-xs text-muted-foreground">FOLIO</p>
                                <p className="truncate font-semibold text-blue-700">{sol.folio}</p>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground">DEPTO. SOLICITANTE</p>
                                <p className="truncate text-sm font-medium">{sol.departamento_solicitante?.nombre}</p>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground">DEPTO. DESTINO</p>
                                <p className="truncate text-sm font-medium">{sol.departamento_destino?.nombre}</p>
                            </div>

                            <div className="w-24 shrink-0">
                                <p className="text-xs text-muted-foreground">TIPO</p>
                                <p className="truncate text-sm font-medium">{sol.tipo_mantenimiento?.nombre}</p>
                            </div>

                            <div className="w-28 shrink-0">
                                <EstadoBadge nombre={sol.estado?.nombre} />
                            </div>

                            <div className="w-24 shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                                {new Date(sol.fecha_elaboracion).toLocaleDateString('es-MX')}
                            </div>

                            <div className="flex shrink-0 flex-nowrap gap-2">
                                <Link href={route('solicitudes.show', sol.id)}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="mr-1 h-4 w-4" />
                                        Ver
                                    </Button>
                                </Link>

                                {sol.puede_tomar && (
                                    <Button size="sm" onClick={() => tomarSolicitud(sol)} disabled={tomarProcessing}>
                                        <UserPlus className="mr-1 h-4 w-4" />
                                        Tomar
                                    </Button>
                                )}

                                {(sol.es_solicitante || sol.es_encargado) && (
                                    <Button variant="outline" size="sm" onClick={() => openEdit(sol)}>
                                        <Pencil className="mr-1 h-4 w-4" />
                                        Editar
                                    </Button>
                                )}

                                <a href={route('solicitudes.imprimir', sol.id)} target="_blank" rel="noreferrer">
                                    <Button variant="outline" size="sm">
                                        <Printer className="mr-1 h-4 w-4" />
                                        Imprimir
                                    </Button>
                                </a>

                                {(sol.es_solicitante || sol.es_encargado) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => confirmDelete(sol)}
                                    >
                                        <Trash2 className="mr-1 h-4 w-4" />
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal: crear / editar */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            {editing ? 'Editar solicitud de mantenimiento' : 'Agregar solicitud de mantenimiento'}
                        </DialogTitle>
                        <DialogDescription>
                            {editing ? 'Modifica los datos de la solicitud.' : 'Registra una nueva solicitud de mantenimiento.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Folio (generado automáticamente)</Label>
                                <Input value={editing ? editing.folio : 'Se genera al guardar'} disabled />
                            </div>
                            <div>
                                <Label htmlFor="fecha_elaboracion">Fecha de Elaboración</Label>
                                <Input
                                    id="fecha_elaboracion"
                                    type="date"
                                    value={data.fecha_elaboracion}
                                    disabled
                                />
                                {errors.fecha_elaboracion && <p className="text-sm text-red-600 mt-1">{errors.fecha_elaboracion}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Departamento Solicitante</Label>
                                <Input
                                    value={
                                        editing
                                            ? editing.departamento_solicitante?.nombre ?? ''
                                            : miPersonal?.departamento_nombre ?? 'Sin departamento asignado'
                                    }
                                    disabled
                                />
                            </div>

                            <div>
                                <Label>Departamento Destino *</Label>
                                {puedeEditarContenido ? (
                                    <>
                                        <Select
                                            value={data.id_departamento_destino}
                                            onValueChange={(v) => setData('id_departamento_destino', v)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                            <SelectContent>
                                                {departamentos.map((d) => (
                                                    <SelectItem key={d.id} value={String(d.id)}>{d.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.id_departamento_destino && <p className="text-sm text-red-600 mt-1">{errors.id_departamento_destino}</p>}
                                    </>
                                ) : (
                                    <Input value={editing?.departamento_destino?.nombre ?? ''} disabled />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Solicitante</Label>
                                <Input
                                    value={
                                        editing
                                            ? editing.solicitante?.nombre_completo ?? ''
                                            : miPersonal?.nombre_completo ?? 'Sin usuario ligado'
                                    }
                                    disabled
                                />
                            </div>

                            <div>
                                <Label>Tipo de Mantenimiento *</Label>
                                {puedeEditarContenido ? (
                                    <>
                                        <Select
                                            value={data.id_tipo_mantenimiento}
                                            onValueChange={(v) => setData('id_tipo_mantenimiento', v)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                            <SelectContent>
                                                {tiposMantenimiento.map((t) => (
                                                    <SelectItem key={t.id} value={String(t.id)}>{t.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.id_tipo_mantenimiento && <p className="text-sm text-red-600 mt-1">{errors.id_tipo_mantenimiento}</p>}
                                    </>
                                ) : (
                                    <Input value={editing?.tipo_mantenimiento?.nombre ?? ''} disabled />
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Estado</Label>
                            {puedeEditarEstado ? (
                                <Select value={data.id_estado} onValueChange={(v) => setData('id_estado', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {estados.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="mt-1">
                                    <EstadoBadge nombre={editing ? editing.estado?.nombre : 'Pendiente'} />
                                    {!editing && <span className="ml-2 text-xs text-muted-foreground">Automático</span>}
                                    {editing && editing.es_solicitante && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            Solo quien atiende puede cambiar el estado
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="descripcion">Descripción del mantenimiento *</Label>
                            {puedeEditarContenido ? (
                                <>
                                    <Textarea
                                        id="descripcion"
                                        placeholder="Describa detalladamente el servicio requerido o falla a reparar..."
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                                </>
                            ) : (
                                <Textarea value={data.descripcion} rows={4} disabled />
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpenForm(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editing ? 'Guardar cambios' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: confirmar eliminación */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-sm">
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle>¿Eliminar solicitud?</DialogTitle>
                        <DialogDescription className="mt-2">
                            Esta acción eliminará permanentemente la solicitud con folio{' '}
                            <strong>{deleting?.folio}</strong>. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={doDelete} disabled={deletingProcessing}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
