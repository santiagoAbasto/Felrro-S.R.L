import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ downloads }) {

    const handleDelete = (id) => {
        if (confirm("¿Eliminar esta descarga? Esta acción no se puede deshacer.")) {
            router.delete(route("admin.downloads.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Descargas" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Gestión Descargas
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Administra los archivos descargables del sitio web.
                        </p>
                    </div>

                    <Link
                        href={route("admin.downloads.create")}
                        className="bg-[#25A7CA] text-white px-6 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition"
                    >
                        + Nueva Descarga
                    </Link>
                </div>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {downloads.length === 0 ? (
                        <div className="p-16 text-center text-gray-500">
                            No hay descargas registradas.
                        </div>
                    ) : (

                        <table className="w-full text-left">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Orden</th>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Formato</th>
                                    <th className="px-6 py-4">Peso</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {downloads.map((download) => (
                                    <tr
                                        key={download.id}
                                        className="hover:bg-gray-50 transition"
                                    >

                                        <td className="px-6 py-4 font-semibold text-gray-700">
                                            {download.order}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">
                                                {download.name?.es}
                                            </div>
                                            {download.name?.en && (
                                                <div className="text-sm text-gray-400">
                                                    {download.name?.en}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {download.format}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {download.weight}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    download.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {download.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right space-x-4">

                                            <Link
                                                href={route("admin.downloads.edit", download.id)}
                                                className="text-[#25A7CA] font-semibold hover:underline"
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(download.id)}
                                                className="text-red-500 font-semibold hover:underline"
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}