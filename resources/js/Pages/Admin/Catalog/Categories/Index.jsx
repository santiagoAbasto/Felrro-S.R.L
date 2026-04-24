import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ categories }) {
    const destroy = (id) => {
        if (!confirm("¿Querés eliminar esta categoría?")) {
            return;
        }

        router.delete(route("admin.product-categories.destroy", id));
    };

    return (
        <AdminLayout>
            <Head title="Categorías" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Listado de categorías"
                    description="Acá podés administrar el orden, la visibilidad y la presencia de cada categoría dentro de la web."
                    actions={
                        <Link
                            href={route("admin.product-categories.create")}
                            className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Nueva categoría
                        </Link>
                    }
                />

                <AdminSectionCard
                    title="Categorías cargadas"
                    description="Cada fila muestra el orden general, si la categoría aparece destacada y su estado actual."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Orden</th>
                                    <th className="px-4 py-3">Destacado</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                                            Todavía no hay categorías registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-slate-700">
                                                    {category.name?.es ?? "Sin nombre"}
                                                </p>
                                                {category.name?.en ? (
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {category.name.en}
                                                    </p>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                    {category.order || "Sin orden"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {category.is_featured ? (
                                                    <span className="rounded-full bg-[#25A7CA]/10 px-3 py-1 text-xs font-semibold text-[#117a98]">
                                                        {category.featured_order
                                                            ? `Orden ${category.featured_order}`
                                                            : "Destacada"}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No destacada</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        category.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-200 text-slate-500"
                                                    }`}
                                                >
                                                    {category.is_active ? "Visible" : "Oculta"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route("admin.product-categories.edit", category.id)}
                                                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(category.id)}
                                                        className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                    >
                                                        Eliminar
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
