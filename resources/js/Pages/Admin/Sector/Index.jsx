import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useCallback } from "react";

export default function Index({ sectors }) {

    const { delete: destroy } = useForm();

    const handleDelete = useCallback((id) => {
        if (confirm("¿Estás seguro de eliminar este sector?")) {
            destroy(route("admin.sectors.destroy", id));
        }
    }, []);

    return (
        <AdminLayout>

            <Head title="Sectores | Admin" />

            <div className="px-8 py-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Sectores
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Gestión de sectores industriales
                        </p>
                    </div>

                    <Link
                        href={route("admin.sectors.create")}
                        className="inline-flex items-center gap-2 bg-[#25A7CA] text-white px-5 py-2.5 rounded-xl shadow hover:opacity-90 transition"
                    >
                        + Nuevo Sector
                    </Link>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                                <th className="px-6 py-4">Orden</th>
                                <th className="px-6 py-4">Imagen</th>
                                <th className="px-6 py-4">Nombre (ES)</th>
                                <th className="px-6 py-4">Activo</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {sectors.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                        No hay sectores registrados.
                                    </td>
                                </tr>
                            )}

                            {sectors.map((sector) => (
                                <tr
                                    key={sector.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >

                                    {/* ORDEN */}
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {sector.order ?? "-"}
                                    </td>

                                    {/* IMAGEN */}
                                    <td className="px-6 py-4">
                                        {sector.image ? (
                                            <img
                                                src={`/storage/${sector.image}`}
                                                alt={sector.name?.es}
                                                className="w-24 h-16 object-cover rounded-lg border"
                                            />
                                        ) : (
                                            <div className="w-24 h-16 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-lg border">
                                                Sin imagen
                                            </div>
                                        )}
                                    </td>

                                    {/* NOMBRE */}
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {sector.name?.es}
                                    </td>

                                    {/* ACTIVO */}
                                    <td className="px-6 py-4">
                                        {sector.is_active ? (
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
                                    <td className="px-6 py-4 text-right space-x-4">

                                        <Link
                                            href={route("admin.sectors.edit", sector.id)}
                                            className="text-[#25A7CA] hover:underline"
                                        >
                                            Editar
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(sector.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Eliminar
                                        </button>

                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>

                </div>

            </div>

        </AdminLayout>
    );
}