import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Toast from "@/Components/Toast";
import {
    AdminPageHeader,
    AdminSectionCard,
} from "@/Components/Admin/FormElements";

export default function Index({ applications, filters }) {
    const { flash } = usePage().props;

    const changeFilter = (key, value) => {
        router.get(route("admin.hr.applications.index"), {
            ...filters,
            [key]: value,
        }, { preserveState: true });
    };

    const destroyApplication = (application) => {
        if (confirm(`¿Querés eliminar la postulación de ${application.full_name}? También se eliminarán sus archivos adjuntos.`)) {
            router.delete(route("admin.hr.applications.destroy", application.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Postulaciones - RRHH" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Postulaciones"
                    description="Revisá las postulaciones recibidas, filtrá por estado y gestioná cada candidato desde una misma vista."
                    actions={
                        <select
                            value={filters?.reviewed ?? ""}
                            onChange={(event) => changeFilter("reviewed", event.target.value)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                        >
                            <option value="">Todos los estados</option>
                            <option value="0">Pendientes</option>
                            <option value="1">Revisados</option>
                        </select>
                    }
                />

                <AdminSectionCard
                    title="Listado de postulaciones"
                    description="Usá las acciones para ver el detalle completo o eliminar una postulación que ya no necesitás conservar."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Puesto</th>
                                    <th className="px-4 py-3">Sector</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {applications.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                            No hay postulaciones disponibles.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.data.map((application) => (
                                        <tr key={application.id}>
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {application.full_name}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {application.position?.title?.es ?? "—"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {application.sector?.name?.es ?? "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        application.is_reviewed
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {application.is_reviewed ? "Revisado" : "Pendiente"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {new Date(application.created_at).toLocaleDateString("es-AR")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap justify-end gap-3">
                                                    <Link
                                                        href={route("admin.hr.applications.show", application.id)}
                                                        className="text-sm font-semibold text-[#25A7CA] transition hover:text-[#1d96b8]"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroyApplication(application)}
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

                    {applications.last_page > 1 ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">
                                Mostrando {applications.from}–{applications.to} de {applications.total}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {applications.links.map((link, index) => (
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
