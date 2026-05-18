import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function Index({ messages }) {

    const handleDelete = (id) => {
        if (confirm("¿Seguro que deseas eliminar este mensaje?")) {
            router.delete(`/admin/contact-messages/${id}`);
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
            <Head title="Mensajes de Contacto" />

            <div className="p-8 bg-gray-50 min-h-screen">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Mensajes de Contacto
                    </h1>

                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                        {messages.data.filter(m => !m.is_read).length} Nuevos
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {messages.data.map((message) => (
                                <tr
                                    key={message.id}
                                    className={`border-t border-gray-200 hover:bg-gray-50 transition ${
                                        !message.is_read ? "bg-blue-50" : ""
                                    }`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {message.nombre}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {message.email}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {formatDate(message.created_at)}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {!message.is_read ? (
                                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                Nuevo
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                                                Leído
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right space-x-2">

                                        <button
                                            onClick={() => router.visit(`/admin/contact-messages/${message.id}`)}
                                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-xs"
                                        >
                                            Ver
                                        </button>

                                        <button
                                            onClick={() => handleDelete(message.id)}
                                            className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-xs"
                                        >
                                            Eliminar
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                {/* PAGINATION */}
                <div className="mt-6 flex justify-end gap-2">
                    {messages.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                                link.active
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-600"
                            } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>
        </AdminLayout>
    );
}