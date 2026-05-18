import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { route } from "ziggy-js";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ products, stats }) {
    const [loadingId, setLoadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products;

        const term = search.toLowerCase();

        return products.filter((product) =>
            product.name?.es?.toLowerCase().includes(term) ||
            product.name?.en?.toLowerCase().includes(term)
        );
    }, [search, products]);

    const toggleFeatured = (product) => {
        setLoadingId(product.id);
        router.patch(
            route("admin.products.toggleFeatured", product.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoadingId(null),
            }
        );
    };

    const destroy = (id) => {
        if (!confirm("¿Querés eliminar este producto? Esta acción no se puede deshacer.")) {
            return;
        }

        setDeletingId(id);

        router.delete(route("admin.products.destroy", id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <AdminLayout>
            <Head title="Productos" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Listado de productos"
                    description="Acá podés revisar el catálogo, buscar un producto específico y definir si debe aparecer como destacado."
                    actions={
                        <Link
                            href={route("admin.products.create")}
                            className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Nuevo producto
                        </Link>
                    }
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Total de productos" value={stats.total} tone="default" />
                    <StatCard title="Destacados" value={stats.featured} tone="accent" />
                    <StatCard title="Activos" value={stats.active} tone="success" />
                </div>

                <AdminSectionCard
                    title="Catálogo cargado"
                    description="Usá el buscador para encontrar un producto por nombre. Desde esta misma tabla también podés activar o quitar destacados."
                >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10 md:max-w-sm"
                        />
                        <span className="text-sm text-slate-400">
                            {filteredProducts.length} producto{filteredProducts.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Producto</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3">Destacado</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                                            No se encontraron productos con ese nombre.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-slate-700">{product.name?.es}</p>
                                                {product.name?.en ? (
                                                    <p className="mt-1 text-xs text-slate-400">{product.name.en}</p>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                    {product.category?.name?.es ?? "Sin categoría"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    type="button"
                                                    disabled={loadingId === product.id}
                                                    onClick={() => toggleFeatured(product)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                                        product.featured ? "bg-[#25A7CA]" : "bg-slate-200"
                                                    } ${loadingId === product.id ? "cursor-not-allowed opacity-50" : ""}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                                            product.featured ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                                {product.featured ? (
                                                    <span className="ml-2 text-xs font-semibold text-[#117a98]">
                                                        {product.featured_order ? `Orden ${product.featured_order}` : "Destacado"}
                                                    </span>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        product.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-200 text-slate-500"
                                                    }`}
                                                >
                                                    {product.is_active ? "Visible" : "Oculto"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route("admin.products.edit", product.id)}
                                                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        href={route("admin.products.pdf-assets.edit", product.id)}
                                                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        PDF / tabla
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === product.id}
                                                        onClick={() => destroy(product.id)}
                                                        className={`rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 ${
                                                            deletingId === product.id ? "cursor-not-allowed opacity-60" : ""
                                                        }`}
                                                    >
                                                        {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, tone }) {
    const toneClass = {
        default: "border-slate-200 bg-white text-slate-900",
        accent: "border-[#25A7CA]/20 bg-[#25A7CA]/[0.05] text-[#117a98]",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    }[tone] ?? "border-slate-200 bg-white text-slate-900";

    return (
        <div className={`rounded-[24px] border p-5 shadow-sm ${toneClass}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{title}</p>
            <p className="mt-2 text-4xl font-semibold">{value}</p>
        </div>
    );
}
