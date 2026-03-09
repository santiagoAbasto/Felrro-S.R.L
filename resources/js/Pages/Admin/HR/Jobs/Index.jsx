import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ positions }) {
    return (
        <AdminLayout>
            <Head title="Puestos Laborales" />
            <div className="p-8 min-h-screen bg-gray-50 font-[Montserrat]">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <h1 className="text-3xl font-bold text-[#101010] leading-tight m-0">
                        Puestos Laborales
                    </h1>
                    <Link
                        href={route("admin.hr.positions.create")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25A7CA] hover:bg-[#1f93b3] text-white text-sm font-semibold no-underline transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Nuevo Puesto
                    </Link>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#DDDDE0]">
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010]">Titulo ES</th>
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010]">Titulo EN</th>
                                <th className="px-5 py-4 text-left text-[13px] font-bold text-[#101010]">Estado</th>
                                <th className="px-5 py-4 text-right text-[13px] font-bold text-[#101010]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-16 text-center text-sm text-[#6E6E6E]">
                                        No hay puestos configurados.
                                    </td>
                                </tr>
                            ) : (
                                positions.data.map((position) => (
                                    <tr key={position.id} className="border-b border-[#DDDDE0] hover:bg-[#f7feff] transition-colors">
                                        <td className="px-5 py-4 text-sm font-bold text-[#101010]">
                                            {position.title?.es ?? "—"}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-normal text-[#101010]">
                                            {position.title?.en ?? "—"}
                                        </td>
                                        <td className="px-5 py-4">
                                            {position.is_active ? (
                                                <span className="inline-flex px-3 py-1 rounded-full bg-[#e6f9f1] text-[#1a7a4a] text-xs font-semibold">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={route("admin.hr.positions.edit", position.id)}
                                                className="inline-flex px-4 py-1.5 rounded-full border border-[#25A7CA] text-[#25A7CA] hover:bg-[#25A7CA] hover:text-white text-xs font-semibold no-underline transition-colors"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminLayout>
    );
}
