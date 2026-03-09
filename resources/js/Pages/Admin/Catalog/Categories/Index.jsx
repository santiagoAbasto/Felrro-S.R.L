import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ categories }) {

    const destroy = (id) => {
        if (confirm("¿Eliminar esta categoría?")) {
            router.delete(route("admin.product-categories.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Categorías" />

            <div className="space-y-10">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestión de Categorías
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Administra el orden y visibilidad de las categorías.
                        </p>
                    </div>

                    <Link
                        href={route("admin.product-categories.create")}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition font-medium"
                    >
                        + Nueva Categoría
                    </Link>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Nombre</th>
                                <th className="px-6 py-4 text-left">Orden</th>
                                <th className="px-6 py-4 text-left">Home</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {cat.name?.es}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700">
                                            {cat.order}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {cat.is_featured ? (
                                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                                                Destacada ({cat.featured_order})
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">
                                                No visible
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {cat.is_active ? (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                                Activa
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">
                                                Inactiva
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right space-x-4">
                                        <Link
                                            href={route("admin.product-categories.edit", cat.id)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Editar
                                        </Link>

                                        <button
                                            onClick={() => destroy(cat.id)}
                                            className="text-rose-600 hover:text-rose-800 font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {categories.length === 0 && (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            No hay categorías registradas todavía.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}