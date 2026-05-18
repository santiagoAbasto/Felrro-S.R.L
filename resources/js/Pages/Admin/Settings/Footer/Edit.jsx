import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    panelInputClass,
} from "@/Components/Admin/FormElements";

const normalizeEmails = (emails = [], fallback = "") => {
    const list = Array.isArray(emails)
        ? emails.filter((email) => (email ?? "").trim() !== "")
        : [];

    if (list.length > 0) {
        return list;
    }

    return fallback ? [fallback] : [""];
};

function FooterIcon({ type }) {
    if (type === "address") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="#25A7CA" strokeWidth="2" />
                <circle cx="12" cy="10" r="3" stroke="#25A7CA" strokeWidth="2" />
            </svg>
        );
    }

    if (type === "phone") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#25A7CA" strokeWidth="2" />
            </svg>
        );
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#25A7CA" strokeWidth="2" />
        </svg>
    );
}

function FooterPreview({ footer }) {
    const emails = footer.emails.filter((email) => email.trim() !== "");

    return (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Vista previa pública
            </p>

            <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                    <FooterIcon type="address" />
                    <span className="text-sm leading-relaxed text-slate-700">
                        {footer.address.es || "La dirección del footer aparecerá acá."}
                    </span>
                </div>

                <div className="flex items-start gap-3">
                    <FooterIcon type="phone" />
                    <span className="text-sm leading-relaxed text-slate-700">
                        {footer.phone || "El teléfono del footer aparecerá acá."}
                    </span>
                </div>

                {emails.length > 0 ? (
                    emails.map((email) => (
                        <div key={email} className="flex items-start gap-3">
                            <FooterIcon type="email" />
                            <span className="text-sm leading-relaxed text-slate-700">{email}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-start gap-3">
                        <FooterIcon type="email" />
                        <span className="text-sm leading-relaxed text-slate-400">
                            Agregá al menos un correo para verlo acá.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Edit({ footer }) {
    const { flash } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        sections_title: {
            es: footer?.sections_title?.es ?? "Secciones",
            en: footer?.sections_title?.en ?? "Sections",
        },
        newsletter_title: {
            es: footer?.newsletter_title?.es ?? "Newsletter",
            en: footer?.newsletter_title?.en ?? "Newsletter",
        },
        contact_title: {
            es: footer?.contact_title?.es ?? "Contacto",
            en: footer?.contact_title?.en ?? "Contact",
        },
        address: {
            es: footer?.address?.es ?? "",
            en: footer?.address?.en ?? "",
        },
        map_url: footer?.map_url ?? "",
        phone: footer?.phone ?? "",
        whatsapp: footer?.whatsapp ?? "",
        emails: normalizeEmails(footer?.emails, footer?.email ?? ""),
        copyright: {
            es: footer?.copyright?.es ?? "",
            en: footer?.copyright?.en ?? "",
        },
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.settings.footer.update"), {
            preserveScroll: true,
        });
    };

    const setLocalized = (group, locale, value) => {
        setData(group, {
            ...data[group],
            [locale]: value,
        });
    };

    const updateEmail = (index, value) => {
        const next = [...data.emails];
        next[index] = value;
        setData("emails", next);
    };

    const addEmail = () => setData("emails", [...data.emails, ""]);
    const removeEmail = (index) => {
        const next = data.emails.filter((_, emailIndex) => emailIndex !== index);
        setData("emails", next.length ? next : [""]);
    };

    return (
        <AdminLayout>
            <Head title="Footer" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Configuración"
                    title="Footer"
                    description="Editá el pie del sitio con la misma referencia visual que aparece en la web pública. El bloque de contactos reutiliza los SVGs reales."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Títulos"
                        description="Textos principales de cada columna del footer."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título de secciones"
                                value={data.sections_title.es}
                                onChange={(value) => setLocalized("sections_title", "es", value)}
                                error={errors["sections_title.es"]}
                            />
                            <AdminTextInput
                                label="Título de secciones en inglés"
                                value={data.sections_title.en}
                                onChange={(value) => setLocalized("sections_title", "en", value)}
                                error={errors["sections_title.en"]}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título de newsletter"
                                value={data.newsletter_title.es}
                                onChange={(value) => setLocalized("newsletter_title", "es", value)}
                                error={errors["newsletter_title.es"]}
                            />
                            <AdminTextInput
                                label="Título de newsletter en inglés"
                                value={data.newsletter_title.en}
                                onChange={(value) => setLocalized("newsletter_title", "en", value)}
                                error={errors["newsletter_title.en"]}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título de contacto"
                                value={data.contact_title.es}
                                onChange={(value) => setLocalized("contact_title", "es", value)}
                                error={errors["contact_title.es"]}
                            />
                            <AdminTextInput
                                label="Título de contacto en inglés"
                                value={data.contact_title.en}
                                onChange={(value) => setLocalized("contact_title", "en", value)}
                                error={errors["contact_title.en"]}
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Contacto del footer"
                        description="Acá configurás dirección, teléfonos y varios correos. Si en WhatsApp flotante no cargás un número propio, ese módulo hereda el de este footer."
                    >
                        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="space-y-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <AdminRichTextarea
                                        label="Dirección"
                                        value={data.address.es}
                                        onChange={(value) => setLocalized("address", "es", value)}
                                        error={errors["address.es"]}
                                        placeholder="Ej: Calle, número, localidad y provincia"
                                    />
                                    <AdminRichTextarea
                                        label="Dirección en inglés"
                                        value={data.address.en}
                                        onChange={(value) => setLocalized("address", "en", value)}
                                        error={errors["address.en"]}
                                        placeholder="Versión en inglés"
                                    />
                                </div>

                                <AdminTextInput
                                    label="URL de mapa"
                                    value={data.map_url}
                                    onChange={(value) => setData("map_url", value)}
                                    placeholder="https://maps.app.goo.gl/..."
                                    error={errors.map_url}
                                    optional
                                />

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <AdminTextInput
                                        label="Teléfono visible"
                                        value={data.phone}
                                        onChange={(value) => setData("phone", value)}
                                        placeholder="Ej: +54 11 1234 5678"
                                        error={errors.phone}
                                    />
                                    <AdminTextInput
                                        label="WhatsApp"
                                        value={data.whatsapp}
                                        onChange={(value) => setData("whatsapp", value)}
                                        placeholder="Ej: +54 9 11 1234 5678"
                                        hint="Este número también puede ser usado por WhatsApp flotante como valor heredado."
                                        error={errors.whatsapp}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">Correos electrónicos</p>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                                Se listan uno debajo del otro en el footer público.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addEmail}
                                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Añadir correo
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.emails.map((email, index) => (
                                            <div key={`footer-email-${index}`} className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white p-3">
                                                <div className="mt-3 shrink-0">
                                                    <FooterIcon type="email" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(event) => updateEmail(index, event.target.value)}
                                                        placeholder="Ej: ventas@felrro.com"
                                                        className={panelInputClass}
                                                    />
                                                    {errors[`emails.${index}`] ? (
                                                        <p className="mt-2 text-xs font-medium text-red-500">{errors[`emails.${index}`]}</p>
                                                    ) : null}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmail(index)}
                                                    className="mt-2 rounded-2xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                    disabled={data.emails.length === 1}
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.emails ? <p className="text-xs font-medium text-red-500">{errors.emails}</p> : null}
                                </div>
                            </div>

                            <FooterPreview footer={data} />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Copyright"
                        description="Texto del pie inferior del sitio."
                        tone="accent"
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Copyright"
                                value={data.copyright.es}
                                onChange={(value) => setLocalized("copyright", "es", value)}
                                error={errors["copyright.es"]}
                            />
                            <AdminTextInput
                                label="Copyright en inglés"
                                value={data.copyright.en}
                                onChange={(value) => setLocalized("copyright", "en", value)}
                                error={errors["copyright.en"]}
                            />
                        </div>
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
