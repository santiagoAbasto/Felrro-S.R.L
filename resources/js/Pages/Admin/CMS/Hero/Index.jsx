import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Index({ sections = [] }) {

    const handleDelete = (id) => {
        if (!confirm("¿Eliminar este slider hero? Se eliminarán también todas sus imágenes. Esta acción no se puede deshacer.")) return;
        router.delete(route("admin.hero.destroy", id));
    };

    return (
        <AdminLayout>

            <Head title="Hero CMS" />

            <div className="px-8 py-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Gestión Hero
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Administración de slides principales del Home.
                        </p>
                    </div>

                    <Link
                        href={route("admin.hero.create")}
                        className="inline-flex items-center gap-2 bg-[#25A7CA] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Nuevo Slider
                    </Link>

                </div>


                {/* TABLE CARD */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    <table className="w-full text-sm">

                        {/* HEAD */}
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">

                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Slides</th>
                                <th className="px-6 py-4">Orden</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>

                            </tr>
                        </thead>


                        {/* BODY */}
                        <tbody>

                            {sections.map((section) => (

                                <tr
                                    key={section.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >

                                    {/* TITULO */}
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {section.title?.es || <span className="text-gray-400 italic">Sin título</span>}
                                    </td>

                                    {/* SLIDES */}
                                    <td className="px-6 py-4 text-gray-500">
                                        {section.images?.length ?? 0} slide{(section.images?.length ?? 0) !== 1 ? "s" : ""}
                                    </td>

                                    {/* ORDEN */}
                                    <td className="px-6 py-4 text-gray-500">
                                        {section.order ?? 0}
                                    </td>

                                    {/* ESTADO */}
                                    <td className="px-6 py-4">

                                        {section.is_active ? (
                                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                                                Inactivo
                                            </span>
                                        )}

                                    </td>

                                    {/* ACCIONES */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4">

                                            <Link
                                                href={route("admin.hero.edit", section.id)}
                                                className="text-[#25A7CA] hover:underline font-medium"
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(section.id)}
                                                className="text-red-500 hover:underline font-medium"
                                            >
                                                Eliminar
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))}


                            {/* EMPTY */}
                            {sections.length === 0 && (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-400"
                                    >
                                        No hay slides Hero registrados.
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
