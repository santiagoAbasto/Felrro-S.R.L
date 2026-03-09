import AdminLayout from "@/Layouts/AdminLayout";
import { route } from "ziggy-js";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ pages = [] }) {

    return (
        <AdminLayout>
            <Head title="Páginas CMS" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Páginas CMS
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Gestión de páginas dinámicas del sitio.
                        </p>
                    </div>

                    <Link
                        href={route("admin.pages.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Nueva Página
                    </Link>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-sm text-gray-600 uppercase tracking-wide">
                                <th className="p-5">Título</th>
                                <th className="p-5">Slug</th>
                                <th className="p-5">Secciones</th>
                                <th className="p-5">Estado</th>
                                <th className="p-5 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pages.map((page) => (
                                <tr key={page.id} className="border-b hover:bg-gray-50 transition">

                                    <td className="p-5 font-medium text-gray-800">
                                        {page.title?.es ?? "Sin título"}
                                    </td>

                                    <td className="p-5 text-gray-500">
                                        {page.slug}
                                    </td>

                                    <td className="p-5 text-gray-500">
                                        {page.sections_count ?? 0}
                                    </td>

                                    <td className="p-5">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                page.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {page.is_active ? "Activa" : "Inactiva"}
                                        </span>
                                    </td>

                                    <td className="p-5 text-right space-x-4">

                                        <Link
                                            href={route("admin.pages.edit", page.id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Editar
                                        </Link>

                                        {page.slug !== "home" && (
                                            <button
                                                onClick={() => {
                                                    if (confirm("¿Seguro que deseas eliminar esta página?")) {
                                                        router.delete(route("admin.pages.destroy", page.id));
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        )}

                                    </td>

                                </tr>
                            ))}

                            {pages.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-400">
                                        No hay páginas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        </AdminLayout>
    );
}