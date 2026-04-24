import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ sectors }) {
    return (
        <AdminLayout>
            <Head title="Sectores internos" />

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
                    description="Podés revisar el nombre visible y el estado de cada sector."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Nombre en inglés</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acción</th>
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
                                                <div className="flex justify-end">
                                                    <Link
                                                        href={route("admin.hr.sectors.edit", sector.id)}
                                                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        Editar
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}
