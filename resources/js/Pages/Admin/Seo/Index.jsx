import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ pages = [] }) {
    return (
        <AdminLayout>
            <Head title="SEO" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Posicionamiento"
                    title="Metadatos SEO"
                    description="Resumen de títulos, descripciones, keywords e imagen social configuradas por página."
                />

                <AdminSectionCard
                    title="Páginas configurables"
                    description="Este panel muestra el estado actual de los metadatos SEO cargados para cada vista pública."
                >
                    <div className="grid gap-4">
                        {pages.length ? pages.map((page) => (
                            <article
                                key={page.key}
                                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                            >
                                <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#25A7CA]">
                                            {page.key}
                                        </p>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {page.label}
                                        </h2>
                                    </div>

                                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                        Vista informativa
                                    </span>
                                </div>

                                <dl className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Título actual
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-700">
                                            {page.title || "Sin definir"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Keywords actuales
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-700">
                                            {page.keywords || "Sin definir"}
                                        </dd>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Descripción actual
                                        </dt>
                                        <dd className="mt-1 text-sm leading-relaxed text-slate-700">
                                            {page.description || "Sin definir"}
                                        </dd>
                                    </div>
                                </dl>
                            </article>
                        )) : (
                            <p className="text-sm text-slate-500">
                                No hay páginas SEO cargadas todavía.
                            </p>
                        )}
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}
