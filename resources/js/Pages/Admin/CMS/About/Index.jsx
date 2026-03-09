import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Index() {

    const { flash } = usePage().props;

    return (
        <AdminLayout>
            <Head title="About CMS" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestión Página Nosotros
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Administración completa del contenido de la página “Sobre Nosotros”.
                    </p>
                </div>

                {/* SUCCESS MESSAGE */}
                {flash?.success && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-6 py-4 rounded-xl">
                        {flash.success}
                    </div>
                )}

                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Página Nosotros
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Edita bloques, textos multilenguaje, imagen principal y video.
                        </p>
                    </div>

                    <div className="pt-4 flex items-center gap-4">

                        <Link
                            href={route("admin.about.edit")}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                        >
                            Editar Página
                        </Link>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}