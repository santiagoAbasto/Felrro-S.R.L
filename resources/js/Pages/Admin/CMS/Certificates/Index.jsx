import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

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

            <div className="p-10">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold">Certificados</h1>
                    <Link
                        href={route("admin.certificates.create")}
                        className="btn-primary"
                    >
                        Crear Certificado
                    </Link>
                </div>

                <table className="w-full bg-white shadow rounded">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Orden</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Activo</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map(cert => (
                            <tr key={cert.id} className="border-t">
                                <td className="p-3 font-semibold">{cert.order}</td>
                                <td className="p-3">{cert.name.es}</td>
                                <td className="p-3">
                                    {cert.is_active ? "Sí" : "No"}
                                </td>
                                <td className="p-3 flex gap-3">
                                    <Link
                                        href={route("admin.certificates.edit", cert.id)}
                                        className="text-blue-600 underline"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => destroyCertificate(cert)}
                                        className="text-red-600 underline"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
