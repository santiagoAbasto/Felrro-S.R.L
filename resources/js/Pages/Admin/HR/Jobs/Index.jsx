import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Toast from "@/Components/Toast";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ positions }) {
    const { flash } = usePage().props;

    const destroyPosition = (position) => {
        if (confirm(`¿Querés eliminar el puesto "${position.title?.es ?? "sin título"}"?`)) {
            router.delete(route("admin.hr.positions.destroy", position.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Puestos laborales" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Puestos laborales"
                    description="Administrá los puestos que aparecen como opción dentro del formulario público de postulaciones."
                    actions={
                        <Link
                            href={route("admin.hr.positions.create")}
                            className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Nuevo puesto
                        </Link>
                    }
                />

                <AdminSectionCard
                    title="Listado de puestos"
                    description="Podés editar, pausar o eliminar puestos que ya no deban ofrecerse."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Título</th>
                                    <th className="px-4 py-3">Título en inglés</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {positions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                            Todavía no hay puestos cargados.
                                        </td>
                                    </tr>
                                ) : (
                                    positions.data.map((position) => (
                                        <tr key={position.id}>
                                            <td className="px-4 py-4 font-medium text-slate-700">
                                                {position.title?.es ?? "—"}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {position.title?.en ?? "—"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        position.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-200 text-slate-500"
                                                    }`}
                                                >
                                                    {position.is_active ? "Activo" : "Pausado"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap justify-end gap-3">
                                                    <Link
                                                        href={route("admin.hr.positions.edit", position.id)}
                                                        className="text-sm font-semibold text-[#25A7CA] transition hover:text-[#1d96b8]"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroyPosition(position)}
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

                    {positions.last_page > 1 ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">
                                Mostrando {positions.from}–{positions.to} de {positions.total}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {positions.links.map((link, index) => (
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
