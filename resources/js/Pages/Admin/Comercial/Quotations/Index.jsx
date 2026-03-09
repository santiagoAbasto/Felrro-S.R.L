import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Icon } from "@iconify/react";

export default function Index({ quotations = [] }) {

    const handleDelete = (id) => {
        if (!confirm("¿Eliminar cotización? Esta acción no se puede deshacer.")) {
            return;
        }

        router.delete(route("admin.comercial.quotations.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Cotizaciones" />

            <div className="p-8 space-y-6">

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Cotizaciones Recibidas
                    </h1>
                    <p className="text-sm text-gray-500">
                        Solicitudes enviadas desde el formulario de cotización.
                    </p>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-left">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-600">Cliente</th>
                                <th className="px-6 py-4 font-medium text-gray-600">Email</th>
                                <th className="px-6 py-4 font-medium text-gray-600">Productos</th>
                                <th className="px-6 py-4 font-medium text-gray-600">Fecha</th>
                                <th className="px-6 py-4 font-medium text-gray-600 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {quotations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No hay cotizaciones registradas.
                                    </td>
                                </tr>
                            )}

                            {quotations.map((q) => (
                                <tr
                                    key={q.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {q.nombre ?? "-"}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {q.email ?? "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {q.items_count ?? 0} productos
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {q.created_at
                                            ? new Date(q.created_at).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td className="px-6 py-4 text-right space-x-2">

                                        {/* VER */}
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    route("admin.comercial.quotations.show", q.id)
                                                )
                                            }
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                        >
                                            <Icon icon="solar:eye-outline" width={14} />
                                            Ver
                                        </button>

                                        {/* ELIMINAR */}
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                                        >
                                            <Icon icon="solar:trash-bin-minimalistic-outline" width={14} />
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