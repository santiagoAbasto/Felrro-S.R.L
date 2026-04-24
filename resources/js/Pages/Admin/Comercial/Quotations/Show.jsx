import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";

export default function Show({ quotation }) {
    if (!quotation) {
        return null;
    }

    return (
        <AdminLayout>
            <Head title={`Cotización #${quotation.id}`} />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Cotización"
                    title={`Solicitud #${quotation.id}`}
                    description={`Enviada el ${
                        quotation.created_at
                            ? new Date(quotation.created_at).toLocaleString()
                            : "-"
                    }`}
                    actions={
                        <Link
                            href={route("admin.comercial.quotations.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Volver al listado
                        </Link>
                    }
                />

                <AdminSectionCard
                    title="Datos del cliente"
                    description="Esta información fue completada por la persona interesada al enviar la solicitud."
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <Info label="Nombre" value={quotation.nombre} />
                        <Info label="Correo" value={quotation.email} />
                        <Info label="Teléfono" value={quotation.telefono} />
                        <Info label="Empresa" value={quotation.empresa} />
                    </div>

                    {quotation.mensaje ? (
                        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-700">Mensaje</p>
                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                {quotation.mensaje}
                            </p>
                        </div>
                    ) : null}
                </AdminSectionCard>

                <AdminSectionCard
                    title="Productos solicitados"
                    description="Acá se listan los productos incluidos en la consulta con la cantidad informada."
                >
                    <div className="space-y-4">
                        {quotation.items?.length === 0 ? (
                            <p className="text-sm text-slate-400">
                                No hay productos asociados a esta solicitud.
                            </p>
                        ) : (
                            quotation.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {item.product?.name?.es ??
                                                item.product?.name?.en ??
                                                "Producto eliminado"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Categoría:{" "}
                                            {item.product?.category?.name?.es ??
                                                item.product?.category?.name?.en ??
                                                "-"}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-[#25A7CA]/10 px-3 py-1 text-xs font-semibold text-[#117a98]">
                                        {item.metros ?? 0} metro{(item.metros ?? 0) === 1 ? "" : "s"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-[22px] border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {label}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">{value ?? "-"}</p>
        </div>
    );
}
