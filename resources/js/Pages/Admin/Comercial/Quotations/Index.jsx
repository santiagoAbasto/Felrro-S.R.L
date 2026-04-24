import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Icon } from "@iconify/react";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ quotations = [] }) {
    const handleDelete = (id) => {
        if (!confirm("¿Eliminar esta solicitud de cotización? Esta acción no se puede deshacer.")) {
            return;
        }

        router.delete(route("admin.comercial.quotations.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Solicitudes de cotización" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Cotización"
                    title="Solicitudes recibidas"
                    description="Desde acá podés revisar las consultas comerciales enviadas desde la web y entrar al detalle de cada una."
                />

                <AdminSectionCard
                    title="Listado de solicitudes"
                    description="La tabla resume quién escribió, cuándo lo hizo y cuántos productos incluyó en su pedido."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Correo</th>
                                    <th className="px-4 py-3">Productos</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {quotations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                                            Todavía no hay solicitudes registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    quotations.map((quotation) => (
                                        <tr key={quotation.id}>
                                            <td className="px-4 py-4 font-medium text-slate-700">
                                                {quotation.nombre ?? "-"}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {quotation.email ?? "-"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-[#25A7CA]/10 px-3 py-1 text-xs font-semibold text-[#117a98]">
                                                    {quotation.items_count ?? 0} producto{(quotation.items_count ?? 0) === 1 ? "" : "s"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">
                                                {quotation.created_at
                                                    ? new Date(quotation.created_at).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.visit(
                                                                route("admin.comercial.quotations.show", quotation.id)
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        <Icon icon="solar:eye-outline" width={14} />
                                                        Ver detalle
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(quotation.id)}
                                                        className="inline-flex items-center gap-1 rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                    >
                                                        <Icon icon="solar:trash-bin-minimalistic-outline" width={14} />
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
