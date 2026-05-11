import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import {
    AdminPageHeader,
    AdminSectionCard,
    AdminTextarea,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";

const normalize = (settings = {}) => ({
    enabled: Boolean(settings.enabled ?? true),
    phone: settings.phone ?? "",
    label: {
        es: settings.label?.es ?? "Contáctanos",
        en: settings.label?.en ?? "Contact us",
    },
    message: {
        es: settings.message?.es ?? "Hola, quisiera recibir asesoramiento sobre cables especiales.",
        en: settings.message?.en ?? "Hello, I would like to receive advice about special cables.",
    },
    bottom_offset: settings.bottom_offset ?? 67,
});

export default function Edit({ settings }) {
    const { flash } = usePage().props;
    const { data, setData, put, processing, errors } = useForm(normalize(settings));

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.settings.floating-whatsapp.update"), {
            preserveScroll: true,
        });
    };

    const setNested = (group, locale, value) => {
        setData(group, {
            ...data[group],
            [locale]: value,
        });
    };

    return (
        <AdminLayout>
            <Head title="WhatsApp flotante" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Web pública"
                    title="WhatsApp flotante"
                    description="Configurá el botón flotante que acompaña la navegación pública. El icono mantiene el SVG y fondo verde corporativo, con animación refinada y tope automático antes del copyright."
                />

                <form onSubmit={submit} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="space-y-8">
                        <AdminSectionCard
                            title="Estado y contacto"
                            description="El número se usa para construir el enlace directo a WhatsApp. Podés escribirlo con espacios o símbolos; el sitio lo limpia automáticamente."
                        >
                            <AdminToggle
                                label="Mostrar botón en la web"
                                hint="Cuando está pausado, el acceso flotante no aparece en ninguna página pública."
                                checked={data.enabled}
                                onChange={(checked) => setData("enabled", checked)}
                                activeText="Activo"
                                inactiveText="Pausado"
                            />

                            <AdminTextInput
                                label="Número de WhatsApp"
                                value={data.phone}
                                onChange={(value) => setData("phone", value)}
                                placeholder="Ej: +54 9 11 1234 5678"
                                error={errors.phone}
                            />

                            <AdminTextInput
                                label="Distancia inferior"
                                type="number"
                                value={data.bottom_offset}
                                onChange={(value) => setData("bottom_offset", value)}
                                placeholder="67"
                                hint="Base en píxeles. El sistema lo eleva solo cuando llega al separador del copyright."
                                error={errors.bottom_offset}
                            />
                        </AdminSectionCard>

                        <AdminSectionCard
                            title="Etiqueta y mensaje"
                            description="La etiqueta aparece como tooltip al pasar el mouse. El mensaje se precarga al abrir WhatsApp."
                            tone="accent"
                        >
                            <div className="grid gap-6 lg:grid-cols-2">
                                <AdminTextInput
                                    label="Etiqueta en español"
                                    value={data.label.es}
                                    onChange={(value) => setNested("label", "es", value)}
                                    placeholder="Contáctanos"
                                    error={errors["label.es"]}
                                    maxLength={80}
                                />

                                <AdminTextInput
                                    label="Etiqueta en inglés"
                                    value={data.label.en}
                                    onChange={(value) => setNested("label", "en", value)}
                                    placeholder="Contact us"
                                    error={errors["label.en"]}
                                    maxLength={80}
                                />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <AdminTextarea
                                    label="Mensaje en español"
                                    value={data.message.es}
                                    onChange={(value) => setNested("message", "es", value)}
                                    placeholder="Hola, quisiera recibir asesoramiento sobre cables especiales."
                                    error={errors["message.es"]}
                                    rows={4}
                                    maxLength={500}
                                    optional
                                />

                                <AdminTextarea
                                    label="Mensaje en inglés"
                                    value={data.message.en}
                                    onChange={(value) => setNested("message", "en", value)}
                                    placeholder="Hello, I would like to ask about special cables."
                                    error={errors["message.en"]}
                                    rows={4}
                                    maxLength={500}
                                    optional
                                />
                            </div>
                        </AdminSectionCard>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setData(normalize(settings))}
                                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white"
                            >
                                Restaurar cambios
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25A7CA]/20 transition hover:bg-[#1d96b8] disabled:opacity-60"
                            >
                                <Icon icon="solar:diskette-outline" width={17} />
                                {processing ? "Guardando..." : "Guardar configuración"}
                            </button>
                        </div>
                    </div>

                    <AdminSectionCard
                        title="Vista previa"
                        description="Referencia visual del botón flotante. En la web pública el tope se calcula contra la línea superior del copyright."
                    >
                        <div className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
                            <div className="space-y-4">
                                <div className="h-16 rounded-3xl bg-white shadow-sm" />
                                <div className="h-24 rounded-3xl bg-white/80 shadow-sm" />
                                <div className="h-36 rounded-3xl bg-[#125A6D]/95 shadow-sm" />
                                <div className="border-t border-slate-200 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Línea de copyright
                                </div>
                            </div>

                            <div className="absolute bottom-24 right-8">
                                <div
                                    className={`group relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(180deg,#31e564_0%,#00c820_52%,#00af1c_100%)] shadow-[0_18px_34px_rgba(0,0,0,0.16),0_6px_18px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-10px_18px_rgba(0,112,21,0.22)] transition ${
                                        data.enabled ? "opacity-100" : "opacity-35 grayscale"
                                    }`}
                                >
                                    <span className="absolute -inset-4 -z-0 rounded-full bg-emerald-300/25 blur-xl" />
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="relative z-10 h-8 w-8 drop-shadow-sm"
                                    >
                                        <path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6L0 24l6.18-1.62A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.9 0-3.75-.5-5.37-1.44l-.38-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.46-.48-.64-.49h-.55c-.19 0-.49.07-.74.35-.25.28-.97.95-.97 2.32 0 1.37.99 2.7 1.13 2.88.14.19 1.95 2.99 4.73 4.2.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.66-.68 1.9-1.34.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33z" />
                                    </svg>
                                    <span className="absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xl">
                                        {data.label.es || "Contáctanos"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </AdminSectionCard>
                </form>
            </div>
        </AdminLayout>
    );
}
