import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

const ALLOWED_MAP_HOSTS = [
    "www.google.com",
    "google.com",
    "www.google.com.ar",
    "google.com.ar",
    "maps.google.com",
];

const extractIframeSrc = (value) => {
    if (!value) return "";

    if (typeof window !== "undefined") {
        try {
            const parser = new window.DOMParser();
            const doc = parser.parseFromString(value, "text/html");
            const iframe = doc.querySelector("iframe");

            if (iframe?.getAttribute("src")) {
                return iframe.getAttribute("src") ?? "";
            }
        } catch {
            // sigue con fallback por regex
        }
    }

    const iframeMatch = value.match(/src=["']([^"']+)["']/i);
    if (iframeMatch?.[1]) {
        return iframeMatch[1];
    }

    const trimmed = value.trim();

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    return "";
};

const sanitizeMapPreviewUrl = (value) => {
    const rawSrc = extractIframeSrc(value);

    if (!rawSrc) {
        return "";
    }

    try {
        const parsed = new URL(rawSrc);

        if (parsed.protocol !== "https:") {
            return "";
        }

        const normalizedHost = parsed.hostname.toLowerCase();
        const normalizedPath = parsed.pathname.toLowerCase();

        if (!ALLOWED_MAP_HOSTS.includes(normalizedHost)) {
            return "";
        }

        if (!normalizedPath.includes("/maps/embed")) {
            return "";
        }

        return parsed.toString();
    } catch {
        return "";
    }
};

export default function Edit({ page }) {
    const banner = page.sections.find((section) => section.type === "contact_banner");
    const info = page.sections.find((section) => section.type === "contact_info");
    const map = page.sections.find((section) => section.type === "contact_map");

    const { data, setData, put, processing, errors } = useForm({
        banner: {
            title: {
                es: banner?.title?.es ?? "",
                en: banner?.title?.en ?? "",
            },
            subtitle: {
                es: banner?.subtitle?.es ?? "",
                en: banner?.subtitle?.en ?? "",
            },
            is_active: banner?.is_active ?? true,
        },
        info: {
            address: {
                es: info?.content?.address?.es ?? "",
                en: info?.content?.address?.en ?? "",
            },
            phone: info?.content?.phone ?? "",
            email: info?.content?.email ?? "",
            schedule: {
                es: info?.content?.schedule?.es ?? "",
                en: info?.content?.schedule?.en ?? "",
            },
            is_active: info?.is_active ?? true,
        },
        map: {
            iframe: info?.content?.iframe ?? map?.content?.iframe ?? "",
            is_active: map?.is_active ?? true,
        },
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.contacto.update"));
    };

    const mapPreviewUrl = sanitizeMapPreviewUrl(data.map.iframe);
    const hasMapCode = (data.map.iframe ?? "").trim().length > 0;

    return (
        <AdminLayout>
            <Head title="Contacto" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Contacto"
                    title="Página de contacto"
                    description="Editá el encabezado, los datos de contacto y el mapa embebido. Todo se mantiene con una guía simple para evitar errores."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Encabezado"
                        description="Es el texto principal que presenta la página de contacto."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título"
                                value={data.banner.title.es}
                                onChange={(value) =>
                                    setData("banner", {
                                        ...data.banner,
                                        title: { ...data.banner.title, es: value },
                                    })
                                }
                                error={errors["banner.title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.banner.title.en}
                                onChange={(value) =>
                                    setData("banner", {
                                        ...data.banner,
                                        title: { ...data.banner.title, en: value },
                                    })
                                }
                                error={errors["banner.title.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Texto de apoyo"
                                value={data.banner.subtitle.es}
                                onChange={(value) =>
                                    setData("banner", {
                                        ...data.banner,
                                        subtitle: { ...data.banner.subtitle, es: value },
                                    })
                                }
                                placeholder="Invitá al visitante a escribir o llamar."
                                error={errors["banner.subtitle.es"]}
                            />
                            <AdminRichTextarea
                                label="Texto de apoyo en inglés"
                                value={data.banner.subtitle.en}
                                onChange={(value) =>
                                    setData("banner", {
                                        ...data.banner,
                                        subtitle: { ...data.banner.subtitle, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["banner.subtitle.en"]}
                                optional
                            />
                        </div>

                        <AdminToggle
                            label="Mostrar encabezado"
                            hint="Si queda oculto, la página seguirá funcionando pero sin este bloque."
                            checked={data.banner.is_active}
                            onChange={(value) => setData("banner", { ...data.banner, is_active: value })}
                        />
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Datos de contacto"
                        description="Completá la información práctica que verá el cliente en la web."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Dirección"
                                value={data.info.address.es}
                                onChange={(value) =>
                                    setData("info", {
                                        ...data.info,
                                        address: { ...data.info.address, es: value },
                                    })
                                }
                                placeholder="Ej: Calle, número, localidad y provincia"
                                error={errors["info.address.es"]}
                            />
                            <AdminRichTextarea
                                label="Dirección en inglés"
                                value={data.info.address.en}
                                onChange={(value) =>
                                    setData("info", {
                                        ...data.info,
                                        address: { ...data.info.address, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["info.address.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Teléfono"
                                value={data.info.phone}
                                onChange={(value) => setData("info", { ...data.info, phone: value })}
                                placeholder="Ej: +54 11 1234 5678"
                                error={errors["info.phone"]}
                            />
                            <AdminTextInput
                                label="Correo electrónico"
                                value={data.info.email}
                                onChange={(value) => setData("info", { ...data.info, email: value })}
                                placeholder="Ej: ventas@felrro.com"
                                type="email"
                                error={errors["info.email"]}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Horario de atención"
                                value={data.info.schedule.es}
                                onChange={(value) =>
                                    setData("info", {
                                        ...data.info,
                                        schedule: { ...data.info.schedule, es: value },
                                    })
                                }
                                placeholder="Ej: Lunes a viernes de 8 a 17 h"
                                error={errors["info.schedule.es"]}
                            />
                            <AdminRichTextarea
                                label="Horario en inglés"
                                value={data.info.schedule.en}
                                onChange={(value) =>
                                    setData("info", {
                                        ...data.info,
                                        schedule: { ...data.info.schedule, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["info.schedule.en"]}
                                optional
                            />
                        </div>

                        <AdminToggle
                            label="Mostrar datos de contacto"
                            hint="Si lo desactivás, la información no se verá en la web."
                            checked={data.info.is_active}
                            onChange={(value) => setData("info", { ...data.info, is_active: value })}
                        />
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Mapa embebido"
                        description="Pegá acá el código del mapa y usá la vista previa para confirmar que cargue correctamente."
                        tone="accent"
                    >
                        <AdminRichTextarea
                            label="Código del mapa"
                            value={data.map.iframe}
                            onChange={(value) => setData("map", { ...data.map, iframe: value })}
                            placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                            hint="No hace falta editar el código salvo para reemplazar el mapa por uno nuevo."
                            error={errors["map.iframe"]}
                            previewTitle="Vista previa del código"
                        />

                        {hasMapCode ? (
                            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Vista previa del mapa
                                </p>
                                {!mapPreviewUrl ? (
                                    <div className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                                        La vista previa solo acepta mapas embebidos seguros de Google Maps usando el código de
                                        <strong> "Insertar un mapa"</strong>.
                                    </div>
                                ) : (
                                    <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200">
                                        <iframe
                                            src={mapPreviewUrl}
                                            title="Vista previa del mapa"
                                            className="h-[320px] w-full"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {mapPreviewUrl ? (
                                    <div className="mt-4">
                                        <a
                                            href={mapPreviewUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Abrir mapa en una pestaña nueva
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        <AdminToggle
                            label="Mostrar mapa"
                            hint="Si lo desactivás, la página se publica sin el mapa."
                            checked={data.map.is_active}
                            onChange={(value) => setData("map", { ...data.map, is_active: value })}
                        />
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Guardando cambios..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
