import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

const stringifyValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "Sin definir";
    }

    if (typeof value === "string") {
        return value;
    }

    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};

export default function Index({ settings = {} }) {
    const entries = Object.entries(settings);

    return (
        <AdminLayout>
            <Head title="Configuración del sitio" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Configuración"
                    title="Ajustes generales"
                    description="Resumen de configuraciones persistidas en la base de datos para el sitio."
                    actions={
                        <>
                            <Link
                                href={route("admin.settings.footer.edit")}
                                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Editar footer
                            </Link>
                            <Link
                                href={route("admin.settings.floating-whatsapp.edit")}
                                className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                            >
                                WhatsApp flotante
                            </Link>
                        </>
                    }
                />

                <AdminSectionCard
                    title="Claves guardadas"
                    description="Cada registro muestra la clave y su valor actual para facilitar auditoría rápida."
                >
                    <div className="grid gap-4">
                        {entries.length ? entries.map(([key, setting]) => (
                            <article
                                key={key}
                                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#25A7CA]">
                                    {key}
                                </p>
                                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">
                                    {stringifyValue(setting?.value ?? setting)}
                                </pre>
                            </article>
                        )) : (
                            <p className="text-sm text-slate-500">
                                No hay configuraciones guardadas todavía.
                            </p>
                        )}
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}
