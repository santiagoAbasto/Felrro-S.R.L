import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Toast from "@/Components/Toast";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ sectors }) {
    const { flash } = usePage().props;

    const destroySector = (sector) => {
        if (confirm(`¿Querés eliminar el sector "${sector.name?.es ?? "sin nombre"}"?`)) {
            router.delete(route("admin.hr.sectors.destroy", sector.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Sectores internos" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Sectores internos"
                    description="Administrá las áreas internas que se usan para organizar puestos y postulaciones."
                    actions={
                        <Link
                            href={route("admin.hr.sectors.create")}
                            className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Nuevo sector
                        </Link>
                    }
                />

                <AdminSectionCard
                    title="Listado de sectores"
                    description="Podés revisar, editar o eliminar sectores que ya no formen parte del flujo interno."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Nombre en inglés</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {sectors.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                            Todavía no hay sectores cargados.
                                        </td>
                                    </tr>
                                ) : (
                                    sectors.data.map((sector) => (
                                        <tr key={sector.id}>
                                            <td className="px-4 py-4 font-medium text-slate-700">
                                                {sector.name?.es ?? "—"}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {sector.name?.en ?? "—"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        sector.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-200 text-slate-500"
                                                    }`}
                                                >
                                                    {sector.is_active ? "Activo" : "Pausado"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap justify-end gap-3">
                                                    <Link
                                                        href={route("admin.hr.sectors.edit", sector.id)}
                                                        className="text-sm font-semibold text-[#25A7CA] transition hover:text-[#1d96b8]"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroySector(sector)}
                                                        className="text-sm font-semibold text-red-500 transition hover:text-red-600"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {sectors.last_page > 1 ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">
                                Mostrando {sectors.from}–{sectors.to} de {sectors.total}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {sectors.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                                            link.active
                                                ? "border-[#25A7CA] bg-[#25A7CA] text-white"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-[#25A7CA]"
                                        } ${!link.url ? "cursor-not-allowed opacity-40" : ""}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}
