import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin — Iniciar sesión" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-white">

                {/* ── PANEL IZQUIERDO — imagen de marca ── */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a1628]">

                    {/* Imagen de fondo — cargá tu imagen en: storage/app/public/branding/login-bg.jpg */}
                    <img
                        src="/storage/branding/login-bg.jpg"
                        alt="Felrro"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Gradiente sobre imagen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0d2044]/70 to-[#25A7CA]/30" />

                    {/* Patrón de puntos decorativo */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #25A7CA 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    />

                    {/* Contenido del panel */}
                    <div className="relative z-10 flex flex-col justify-between p-12 w-full">

                        {/* Logo / marca */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/storage/branding/logo-white.png"
                                alt="Felrro"
                                className="h-10 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Felrro
                            </span>
                        </div>

                        {/* Texto central */}
                        <div>
                            <div className="w-12 h-1 bg-[#25A7CA] mb-6 rounded-full" />
                            <h1
                                className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-4"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Panel de<br />Administración
                            </h1>
                            <p className="text-white/60 text-base leading-relaxed max-w-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Gestión de productos, categorías, cotizaciones y configuración del sitio.
                            </p>
                        </div>

                        {/* Footer del panel */}
                        <p className="text-white/30 text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            © {new Date().getFullYear()} Felrro S.R.L. — Cables Especiales
                        </p>
                    </div>
                </div>

                {/* ── PANEL DERECHO — formulario ── */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white">
                    <div className="w-full max-w-md">

                        {/* Logo móvil (visible solo en mobile) */}
                        <div className="flex justify-center mb-8 lg:hidden">
                            <img
                                src="/storage/branding/logo.png"
                                alt="Felrro"
                                className="h-12 object-contain"
                                onError={(e) => {
                                    e.target.replaceWith(
                                        Object.assign(document.createElement('span'), {
                                            textContent: 'Felrro',
                                            className: 'text-2xl font-bold text-[#101010]'
                                        })
                                    );
                                }}
                            />
                        </div>

                        {/* Encabezado */}
                        <div className="mb-8">
                            <h2
                                className="text-3xl font-bold text-[#101010] mb-2"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Bienvenido
                            </h2>
                            <p className="text-[#6B6B6B] text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Ingresá tus credenciales para continuar
                            </p>
                        </div>

                        {/* Status message */}
                        {status && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {status}
                            </div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={submit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-500 text-[#101010] mb-2"
                                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    {/* Ícono */}
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="tu@email.com"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#D9D9D9] bg-white text-[#101010] text-sm outline-none transition-all duration-200 focus:border-[#25A7CA] focus:ring-2 focus:ring-[#25A7CA]/15 placeholder:text-[#AAAAAA]"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm mb-2"
                                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500, color: '#101010' }}
                                >
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-12 pl-11 pr-12 rounded-2xl border border-[#D9D9D9] bg-white text-[#101010] text-sm outline-none transition-all duration-200 focus:border-[#25A7CA] focus:ring-2 focus:ring-[#25A7CA]/15 placeholder:text-[#AAAAAA]"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    />
                                    {/* Toggle mostrar/ocultar */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#25A7CA] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span
                                        className="text-sm text-[#6B6B6B] select-none"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    >
                                        Recordarme
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('admin.password.request')}
                                        className="text-sm text-[#25A7CA] hover:text-[#1f93b3] transition-colors"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Botón submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 rounded-2xl bg-[#25A7CA] text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-[#1f93b3] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Ingresando...
                                    </>
                                ) : (
                                    <>
                                        Ingresar
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Footer */}
                        <p
                            className="mt-8 text-center text-xs text-[#AAAAAA]"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            © {new Date().getFullYear()} Felrro S.R.L. — Panel Administrativo
                        </p>

                    </div>
                </div>

            </div>
        </>
    );
}
