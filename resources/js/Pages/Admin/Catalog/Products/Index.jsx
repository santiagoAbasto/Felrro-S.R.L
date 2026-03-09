import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useMemo } from "react";

export default function Index({ products, stats }) {
    const [loadingId, setLoadingId] = useState(null);
    const [search, setSearch] = useState("");

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products;
        return products.filter(p =>
            p.name?.es?.toLowerCase().includes(search.toLowerCase()) ||
            p.name?.en?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, products]);

    const toggleFeatured = (product) => {
        setLoadingId(product.id);
        router.patch(
            route("admin.products.toggleFeatured", product.id),
            {},
            { preserveScroll: true, onFinish: () => setLoadingId(null) }
        );
    };

    const destroy = (id) => {
        if (!confirm("¿Seguro que deseas eliminar este producto? Esta acción es irreversible.")) return;
        router.delete(route("admin.products.destroy", id), { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Productos" />

            <div className="space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Gestión de Productos
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Administración completa del catálogo industrial
                        </p>
                    </div>
                    <Link
                        href={route("admin.products.create")}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition font-medium"
                    >
                        + Nuevo Producto
                    </Link>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard title="Total productos" value={stats.total} color="indigo" />
                    <StatCard title="Destacados en Home" value={stats.featured} color="violet" />
                    <StatCard title="Activos" value={stats.active} color="emerald" />
                </div>

                {/* SEARCH + TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Barra superior */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-72 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                        <span className="text-xs text-gray-400">
                            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* TABLE */}
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Producto</th>
                                <th className="px-6 py-4 text-left">Categoría</th>
                                <th className="px-6 py-4 text-left">Home</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">

                                    {/* Nombre */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-800">
                                            {product.name?.es}
                                        </span>
                                        {product.name?.en && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {product.name.en}
                                            </p>
                                        )}
                                    </td>

                                    {/* Categoría */}
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700">
                                            {product.category?.name?.es ?? "—"}
                                        </span>
                                    </td>

                                    {/* Home / Featured */}
                                    <td className="px-6 py-4">
                                        <button
                                            disabled={loadingId === product.id}
                                            onClick={() => toggleFeatured(product)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                product.featured ? "bg-indigo-600" : "bg-gray-200"
                                            } ${loadingId === product.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                    product.featured ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                        {product.featured && (
                                            <span className="ml-2 text-xs text-indigo-500 font-medium">
                                                #{product.featured_order}
                                            </span>
                                        )}
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">
                                        {product.is_active ? (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">
                                                Inactivo
                                            </span>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <Link
                                            href={route("admin.products.edit", product.id)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => destroy(product.id)}
                                            className="text-rose-600 hover:text-rose-800 font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            No se encontraron productos.
                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
}

/* =========================================================
   STATS CARD
========================================================= */
function StatCard({ title, value, color }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        violet: "bg-violet-50 text-violet-700 border-violet-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
        <div className={`rounded-2xl border p-5 shadow-sm ${colors[color] ?? colors.indigo}`}>
            <p className="text-xs uppercase tracking-wide font-medium opacity-70">{title}</p>
            <p className="text-4xl font-bold mt-1">{value}</p>
        </div>
    );
}
