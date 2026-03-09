import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Index({ sections = [] }) {
    return (
        <AdminLayout>
            <Head title="Secciones CMS" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Secciones CMS
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Gestión de bloques visuales del sitio (Hero, About, etc.)
                    </p>
                </div>

                {/* LISTADO */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {sections.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No hay secciones registradas.
                        </div>
                    )}

                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="flex justify-between items-center px-8 py-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                        >
                            <div className="space-y-1">
                                <div className="font-semibold text-gray-800">
                                    {section.title?.es ?? "Sin título"}
                                </div>

                                <div className="text-sm text-gray-500">
                                    Tipo: {section.type}
                                </div>

                                <div className="text-xs text-gray-400">
                                    Página: {section.page?.slug ?? "-"}
                                </div>
                            </div>

                            <Link
                                href={route("admin.page-sections.edit", section.id)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Editar
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}