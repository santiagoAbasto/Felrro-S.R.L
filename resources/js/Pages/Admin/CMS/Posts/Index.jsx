import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ posts }) {

    const handleDelete = (id) => {
        if (confirm("¿Eliminar esta novedad?")) {
            router.delete(route("admin.posts.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Novedades" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Gestión Novedades
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Administra las publicaciones del sitio.
                        </p>
                    </div>

                    <Link
                        href={route("admin.posts.create")}
                        className="bg-[#25A7CA] text-white px-6 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition"
                    >
                        + Nueva Novedad
                    </Link>
                </div>

                {/* ================= TABLA ================= */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {posts.length === 0 ? (
                        <div className="p-16 text-center text-gray-500">
                            No hay novedades registradas.
                        </div>
                    ) : (

                        <table className="w-full text-left">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Orden</th>
                                    <th className="px-6 py-4">Imagen</th>
                                    <th className="px-6 py-4">Título</th>
                                    <th className="px-6 py-4">Destacado</th>
                                    <th className="px-6 py-4">Activo</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition">

                                        {/* ORDEN */}
                                        <td className="px-6 py-4 font-semibold">
                                            {post.order}
                                        </td>

                                        {/* IMAGEN CORREGIDA */}
                                        <td className="px-6 py-4">
                                            {post.image_url && (
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title?.es ?? "Novedad"}
                                                    className="w-16 h-12 object-cover rounded-lg border"
                                                />
                                            )}
                                        </td>

                                        {/* TITULO */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">
                                                {post.title?.es}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {post.title?.en}
                                            </div>
                                        </td>

                                        {/* DESTACADO */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                                    post.is_featured
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {post.is_featured ? "Destacado" : "Normal"}
                                            </span>
                                        </td>

                                        {/* ACTIVO */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                                    post.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {post.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>

                                        {/* ACCIONES */}
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <Link
                                                href={route("admin.posts.edit", post.id)}
                                                className="text-[#25A7CA] font-semibold hover:underline"
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-500 font-semibold hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}