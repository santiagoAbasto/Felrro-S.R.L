import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Index({ certificates }) {
    const destroyCertificate = (certificate) => {
        if (!confirm(`¿Eliminar el certificado "${certificate.name?.es ?? "sin nombre"}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        router.delete(route("admin.certificates.destroy", certificate.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Certificados" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Certificados"
                    description="Acá podés revisar, ordenar y editar los certificados que aparecen en la web dentro de la sección Calidad."
                    actions={
                        <Link
                            href={route("admin.certificates.create")}
                            className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Nuevo certificado
                        </Link>
                    }
                />

                <AdminSectionCard
                    title="Listado actual"
                    description="Cada fila muestra el estado del certificado y te permite editarlo o eliminarlo."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Orden</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {certificates.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                            Todavía no hay certificados cargados.
                                        </td>
                                    </tr>
                                ) : (
                                    certificates.map((certificate) => (
                                        <tr key={certificate.id}>
                                            <td className="px-4 py-4 font-semibold text-slate-700">
                                                {certificate.order}
                                            </td>
                                            <td className="px-4 py-4 text-slate-700">
                                                {certificate.name?.es ?? "Sin nombre"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        certificate.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-200 text-slate-500"
                                                    }`}
                                                >
                                                    {certificate.is_active ? "Visible" : "Oculto"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route("admin.certificates.edit", certificate.id)}
                                                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroyCertificate(certificate)}
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
