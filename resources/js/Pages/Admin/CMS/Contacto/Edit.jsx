import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
    panelInputClass,
} from "@/Components/Admin/FormElements";

const ALLOWED_MAP_HOSTS = [
    "www.google.com",
    "google.com",
    "www.google.com.ar",
    "google.com.ar",
    "maps.google.com",
];

const normalizeEmails = (emails = [], fallback = "") => {
    const list = Array.isArray(emails)
        ? emails.filter((email) => (email ?? "").trim() !== "")
        : [];

    if (list.length > 0) {
        return list;
    }

    return fallback ? [fallback] : [""];
};

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
            // fallback regex
        }
    }

    const iframeMatch = value.match(/src=["']([^"']+)["']/i);
    if (iframeMatch?.[1]) {
        return iframeMatch[1];
    }

    const trimmed = value.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : "";
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

function ContactIcon({ type }) {
    if (type === "address") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="#25A7CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#25A7CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (type === "phone") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#25A7CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#25A7CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ContactPreview({ address, phone, emails }) {
    const visibleEmails = emails.filter((email) => email.trim() !== "");

    return (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Vista previa pública
            </p>

            <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                    <ContactIcon type="address" />
                    <span className="text-sm leading-relaxed text-slate-700">
                        {address || "La dirección aparecerá acá."}
                    </span>
                </div>

                <div className="flex items-start gap-3">
                    <ContactIcon type="phone" />
                    <span className="text-sm leading-relaxed text-slate-700">
                        {phone || "El teléfono aparecerá acá."}
                    </span>
                </div>

                {visibleEmails.length > 0 ? (
                    visibleEmails.map((email) => (
                        <div key={email} className="flex items-start gap-3">
                            <ContactIcon type="email" />
                            <span className="text-sm leading-relaxed text-slate-700">{email}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-start gap-3">
                        <ContactIcon type="email" />
                        <span className="text-sm leading-relaxed text-slate-400">
                            Agregá al menos un correo para verlo acá.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Edit({ page }) {
    const { flash } = usePage().props;
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
            emails: normalizeEmails(info?.content?.emails, info?.content?.email ?? ""),
            schedule: {
                es: info?.content?.schedule?.es ?? "",
                en: info?.content?.schedule?.en ?? "",
            },
            is_active: info?.is_active ?? true,
        },
        map: {
            iframe: map?.content?.iframe ?? "",
            is_active: map?.is_active ?? true,
        },
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.contacto.update"));
    };

    const updateInfoEmail = (index, value) => {
        const next = [...data.info.emails];
        next[index] = value;
        setData("info", { ...data.info, emails: next });
    };

    const addInfoEmail = () => {
        setData("info", { ...data.info, emails: [...data.info.emails, ""] });
    };

    const removeInfoEmail = (index) => {
        const next = data.info.emails.filter((_, emailIndex) => emailIndex !== index);
        setData("info", { ...data.info, emails: next.length ? next : [""] });
    };

    const mapPreviewUrl = sanitizeMapPreviewUrl(data.map.iframe);
    const hasMapCode = (data.map.iframe ?? "").trim().length > 0;

    return (
        <AdminLayout>
            <Head title="Contacto" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Contacto"
                    title="Página de contacto"
                    description="Editá el encabezado, los datos visibles y el mapa. Los íconos de referencia usan exactamente el mismo SVG que ve el usuario en la web pública."
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
                                onChange={(value) => setData("banner", { ...data.banner, title: { ...data.banner.title, es: value } })}
                                error={errors["banner.title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.banner.title.en}
                                onChange={(value) => setData("banner", { ...data.banner, title: { ...data.banner.title, en: value } })}
                                error={errors["banner.title.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Texto de apoyo"
                                value={data.banner.subtitle.es}
                                onChange={(value) => setData("banner", { ...data.banner, subtitle: { ...data.banner.subtitle, es: value } })}
                                placeholder="Invitá al visitante a escribir o llamar."
                                error={errors["banner.subtitle.es"]}
                            />
                            <AdminRichTextarea
                                label="Texto de apoyo en inglés"
                                value={data.banner.subtitle.en}
                                onChange={(value) => setData("banner", { ...data.banner, subtitle: { ...data.banner.subtitle, en: value } })}
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
                        description="Podés cargar varios correos y ver cómo se mostrarán en la página pública."
                    >
                        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="space-y-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <AdminRichTextarea
                                        label="Dirección"
                                        value={data.info.address.es}
                                        onChange={(value) => setData("info", { ...data.info, address: { ...data.info.address, es: value } })}
                                        placeholder="Ej: Calle, número, localidad y provincia"
                                        error={errors["info.address.es"]}
                                    />
                                    <AdminRichTextarea
                                        label="Dirección en inglés"
                                        value={data.info.address.en}
                                        onChange={(value) => setData("info", { ...data.info, address: { ...data.info.address, en: value } })}
                                        placeholder="Versión en inglés"
                                        error={errors["info.address.en"]}
                                        optional
                                    />
                                </div>

                                <AdminTextInput
                                    label="Teléfono"
                                    value={data.info.phone}
                                    onChange={(value) => setData("info", { ...data.info, phone: value })}
                                    placeholder="Ej: +54 11 1234 5678"
                                    error={errors["info.phone"]}
                                />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">Correos electrónicos</p>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                                Se mostrarán uno debajo del otro con el mismo ícono de la web pública.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addInfoEmail}
                                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Añadir correo
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.info.emails.map((email, index) => (
                                            <div key={`contact-email-${index}`} className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white p-3">
                                                <div className="mt-3 shrink-0">
                                                    <ContactIcon type="email" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(event) => updateInfoEmail(index, event.target.value)}
                                                        placeholder="Ej: ventas@felrro.com"
                                                        className={panelInputClass}
                                                    />
                                                    {errors[`info.emails.${index}`] ? (
                                                        <p className="mt-2 text-xs font-medium text-red-500">{errors[`info.emails.${index}`]}</p>
                                                    ) : null}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeInfoEmail(index)}
                                                    className="mt-2 rounded-2xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                    disabled={data.info.emails.length === 1}
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors["info.emails"] ? (
                                        <p className="text-xs font-medium text-red-500">{errors["info.emails"]}</p>
                                    ) : null}
                                </div>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <AdminRichTextarea
                                        label="Horario de atención"
                                        value={data.info.schedule.es}
                                        onChange={(value) => setData("info", { ...data.info, schedule: { ...data.info.schedule, es: value } })}
                                        placeholder="Ej: Lunes a viernes de 8 a 17 h"
                                        error={errors["info.schedule.es"]}
                                    />
                                    <AdminRichTextarea
                                        label="Horario en inglés"
                                        value={data.info.schedule.en}
                                        onChange={(value) => setData("info", { ...data.info, schedule: { ...data.info.schedule, en: value } })}
                                        placeholder="Versión en inglés"
                                        error={errors["info.schedule.en"]}
                                        optional
                                    />
                                </div>
                            </div>

                            <ContactPreview
                                address={data.info.address.es}
                                phone={data.info.phone}
                                emails={data.info.emails}
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
