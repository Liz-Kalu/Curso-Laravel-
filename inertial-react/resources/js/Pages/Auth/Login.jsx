import { route } from 'ziggy-js';
import { useState } from 'react';
import { Checkbox } from '@/Components/ui/checkbox';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { User, Lock, Eye, EyeOff, Wrench } from 'lucide-react';
import __ from '@/Hooks/useTranslation.js';

function saludoSegunHora() {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        usuario: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"
            style={{
                backgroundImage:
                    'radial-gradient(circle, rgb(203 213 225 / 0.6) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
            }}
        >
            <Head title="Iniciar sesión" />

            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5">
                {/* Header sobrio dentro de la misma card */}
                <div className="bg-blue-900 px-8 pb-12 pt-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                        <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-base font-semibold text-white">
                        Sistema de Solicitudes de Mantenimiento
                    </h2>
                    <p className="mt-1 text-xs text-blue-200">
                        Instituto Tecnológico de Tepic
                    </p>
                </div>

                {/* Logo institucional montado sobre la unión del header y el body */}
                <div className="flex justify-center">
                    <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-md">
                        <img
                            src="/images/escudo-tec.png"
                            alt="Logo ITT"
                            className="h-10 w-10 object-contain"
                        />
                    </div>
                </div>

                {/* Formulario */}
                <div className="px-8 pb-8 pt-4">
                    <div className="mb-6 text-center">
                        <h1 className="text-lg font-semibold text-gray-900">{saludoSegunHora()}</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="usuario">{__('Usuario')}</Label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="usuario"
                                    type="text"
                                    name="usuario"
                                    placeholder="Ingresa tu usuario"
                                    value={data.usuario}
                                    className="pl-9"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('usuario', e.target.value)}
                                />
                            </div>
                            {errors.usuario && (
                                <p className="mt-1 text-sm text-red-600">{errors.usuario}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">{__('Password')}</Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={data.password}
                                    className="px-9"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-gray-600">
                                {__('Remember me')}
                            </Label>
                        </div>

                        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={processing}>
                            Ingresar
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
