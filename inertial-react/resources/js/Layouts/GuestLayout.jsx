import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/Components/ui/sonner';

export default function GuestLayout({ children }) {
    const { status } = usePage().props;

    useEffect(() => {
        if (status) {
            toast.success(status);
        }
    }, [status]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <Toaster />

            <div className="mb-6 flex flex-col items-center gap-3">
                <img
                    src="/images/escudo-tec.png"
                    alt="Logo ITT"
                    className="h-16 w-16 rounded-xl object-contain shadow-sm"
                />
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                        Instituto Tecnológico de Tepic
                    </p>
                    <p className="text-sm text-gray-500">
                        Sistema de Solicitudes de Mantenimiento
                    </p>
                </div>
            </div>

            <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
                {children}
            </div>

            <p className="mt-6 text-xs text-gray-400">
                © {new Date().getFullYear()} ITT — Todos los derechos reservados
            </p>
        </div>
    );
}
