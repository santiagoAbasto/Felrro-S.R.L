import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function Show({ message }) {

    const handleDelete = () => {
        if (confirm("¿Seguro que deseas eliminar este mensaje?")) {
            router.delete(`/admin/contact-messages/${message.id}`);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminLayout>
            <Head title={`Mensaje - ${message.nombre}`} />

            <div className="p-8 bg-gray-50 min-h-screen">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Detalle del Mensaje
                    </h1>

                    <button
                        onClick={() => router.visit("/admin/contact-messages")}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
                    >
                        Volver
                    </button>
                </div>

                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">

                    {/* ESTADO */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {message.nombre}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {formatDate(message.created_at)}
                            </p>
                        </div>

                        {!message.is_read ? (
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                                Nuevo
                            </span>
                        ) : (
                            <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-xs">
                                Leído
                            </span>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-4">

                        <div>
                            <p className="text-xs uppercase text-gray-400">Email</p>
                            <p className="text-gray-700">{message.email}</p>
                        </div>

                        {message.telefono && (
                            <div>
                                <p className="text-xs uppercase text-gray-400">Teléfono</p>
                                <p className="text-gray-700">{message.telefono}</p>
                            </div>
                        )}

                        {message.empresa && (
                            <div>
                                <p className="text-xs uppercase text-gray-400">Empresa</p>
                                <p className="text-gray-700">{message.empresa}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs uppercase text-gray-400">Mensaje</p>
                            <div className="mt-2 bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-line">
                                {message.mensaje}
                            </div>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">

                        <a
                            href={`mailto:${message.email}?subject=Respuesta a tu consulta - Felrro`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Responder
                        </a>

                        <button
                            onClick={handleDelete}
                            className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}