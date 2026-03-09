import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Icon } from "@iconify/react";

export default function Show({ quotation }) {

    if (!quotation) {
        return null;
    }

    return (
        <AdminLayout>
            <Head title={`Cotización #${quotation.id}`} />

            <div className="p-8 space-y-8">

                {/* BACK */}
                <button
                    onClick={() => router.visit(route("admin.comercial.quotations.index"))}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    <Icon icon="solar:arrow-left-outline" width={16} />
                    Volver
                </button>

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Cotización #{quotation.id}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enviada el{" "}
                        {quotation.created_at
                            ? new Date(quotation.created_at).toLocaleString()
                            : "-"}
                    </p>
                </div>

                {/* CLIENT DATA */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Información del Cliente
                    </h2>

                    <div className="grid grid-cols-2 gap-6 text-sm">

                        <div>
                            <p className="text-gray-500">Nombre</p>
                            <p className="font-medium">{quotation.nombre ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">{quotation.email ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Teléfono</p>
                            <p className="font-medium">{quotation.telefono ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Empresa</p>
                            <p className="font-medium">{quotation.empresa ?? "-"}</p>
                        </div>

                    </div>

                    {quotation.mensaje && (
                        <div className="mt-6">
                            <p className="text-gray-500 text-sm">Mensaje</p>
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-line">
                                {quotation.mensaje}
                            </div>
                        </div>
                    )}
                </div>

                {/* PRODUCTS */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Productos Cotizados
                    </h2>

                    <div className="space-y-4">

                        {quotation.items?.length === 0 && (
                            <p className="text-gray-500 text-sm">
                                No hay productos asociados.
                            </p>
                        )}

                        {quotation.items?.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b border-gray-100 pb-3"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {item.product?.name?.es ??
                                            item.product?.name?.en ??
                                            "Producto eliminado"}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Categoría:{" "}
                                        {item.product?.category?.name?.es ??
                                            item.product?.category?.name?.en ??
                                            "-"}
                                    </p>
                                </div>

                                <div className="text-sm text-gray-700">
                                    {item.metros ?? 0} metros
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}