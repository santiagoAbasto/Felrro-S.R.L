import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ applications, filters }) {

    const changeFilter = (key, value) => {
        router.get(route("admin.hr.applications.index"), {
            ...filters,
            [key]: value
        }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Postulaciones - RRHH" />

            <div className="p-8 min-h-screen bg-gray-50 font-[Montserrat]">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <h1 className="text-3xl font-bold text-[#101010] leading-tight m-0">
                        Postulaciones
                    </h1>

                    {/* FILTRO */}
                    <div className="relative">
                        <select
                            value={filters?.reviewed ?? ""}
                            onChange={(e) => changeFilter("reviewed", e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-[#D9D9D9] bg-white text-[#101010] text-sm font-normal outline-none cursor-pointer min-w-[180px] focus:border-[#25A7CA] transition-colors"
                        >
                            <option value="">Todos los estados</option>
                            <option value="0">Pendientes</option>
                            <option value="1">Revisados</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="#101010"
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#DDDDE0]">
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010] whitespace-nowrap">
                                    Nombre
                                </th>
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010] whitespace-nowrap">
                                    Puesto
                                </th>
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010] whitespace-nowrap">
                                    Sector
                                </th>
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010] whitespace-nowrap">
                                    Estado
                                </th>
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010] whitespace-nowrap">
                                    Fecha
                                </th>
                                <th className="px-5 py-4 text-right text-[13px] font-bold text-[#101010]">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6}
                                        className="px-5 py-16 text-center text-sm text-[#6E6E6E]">
                                        No hay postulaciones disponibles.
                                    </td>
                                </tr>
                            ) : (
                                applications.data.map((app) => (
                                    <tr key={app.id}
                                        className="border-b border-[#DDDDE0] hover:bg-[#f7feff] transition-colors">

                                        <td className="px-5 py-4 text-sm font-bold text-[#101010]">
                                            {app.full_name}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-normal text-[#101010]">
                                            {app.position?.title?.es ?? "—"}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-normal text-[#101010]">
                                            {app.sector?.name?.es ?? "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {app.is_reviewed ? (
                                                <span className="inline-flex px-3 py-1 rounded-full bg-[#e6f9f1] text-[#1a7a4a] text-xs font-semibold whitespace-nowrap">
                                                    Revisado
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-3 py-1 rounded-full bg-[#fff8e1] text-[#b45309] text-xs font-semibold whitespace-nowrap">
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-normal text-[#101010]">
                                            {new Date(app.created_at).toLocaleDateString("es-AR")}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={route("admin.hr.applications.show", app.id)}
                                                className="inline-flex px-5 py-2 rounded-full bg-[#25A7CA] hover:bg-[#1f93b3] text-white text-[13px] font-semibold no-underline transition-colors whitespace-nowrap"
                                            >
                                                Ver
                                            </Link>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                {applications.last_page > 1 && (
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <span className="text-[13px] text-[#6E6E6E]">
                            Mostrando {applications.from}–{applications.to} de {applications.total}
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                            {applications.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-colors
                                        ${link.active
                                            ? "bg-[#25A7CA] border-[#25A7CA] text-white"
                                            : "bg-white border-[#D9D9D9] text-[#101010] hover:border-[#25A7CA]"
                                        }
                                        ${!link.url ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
