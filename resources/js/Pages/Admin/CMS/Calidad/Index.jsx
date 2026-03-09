import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function Index({ section }) {

    return (
        <AdminLayout>
            <Head title="Calidad - CMS" />

            <div className="p-10 bg-gray-50 min-h-screen">

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestión Calidad
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Edita el contenido principal de la página Calidad.
                        </p>
                    </div>

                    <button
                        onClick={() => router.visit(route("admin.cms.calidad.edit"))}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition flex items-center gap-2"
                    >
                        <Icon icon="solar:pen-outline" width={18} />
                        Editar sección
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                    <div className="grid grid-cols-2 gap-8">

                        <div>
                            <h2 className="font-semibold text-gray-900 mb-2">
                                Estado
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                section?.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                            }`}>
                                {section?.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900 mb-2">
                                Imagen
                            </h2>

                            {section?.image ? (
                                <img
                                    src={`/storage/${section.image}`}
                                    className="w-40 h-40 object-cover rounded-xl border"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">
                                    Sin imagen cargada
                                </span>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}