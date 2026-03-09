import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ clients }) {

    const destroy = (id) => {
        if (confirm("¿Eliminar cliente?")) {
            router.delete(route("admin.clients.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Clientes" />
            <div className="space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                        <p className="text-gray-500 text-sm mt-1">Administra los clientes visibles en el sitio.</p>
                    </div>
                    <Link
                        href={route("admin.clients.create")}
                        className="inline-flex items-center gap-2 bg-[#25A7CA] text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#1f93b3] transition font-medium text-sm"
                    >
                        + Nuevo Cliente
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Logo</th>
                                <th className="px-6 py-4 text-left">Nombre</th>
                                <th className="px-6 py-4 text-left">Website</th>
                                <th className="px-6 py-4 text-left">Orden</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50 transition">

                                    <td className="px-6 py-4">
                                        {client.logo_url ? (
                                            <div className="w-16 h-10 flex items-center">
                                                <img src={client.logo_url} alt={client.name?.es} className="max-h-10 max-w-16 object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">Sin logo</div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-800">{client.name?.es}</span>
                                        {client.name?.en && <p className="text-xs text-gray-400 mt-0.5">{client.name.en}</p>}
                                    </td>

                                    <td className="px-6 py-4">
                                        {client.website ? (
                                            <a href={client.website} target="_blank" rel="noopener noreferrer"
                                                className="text-[#25A7CA] hover:underline text-xs truncate max-w-[160px] block">
                                                {client.website.replace(/^https?:\/\//, "")}
                                            </a>
                                        ) : (
                                            <span className="text-gray-300 text-xs">—</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700">
                                            {client.order}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {client.is_active ? (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Activo</span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">Inactivo</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right space-x-4">
                                        <Link href={route("admin.clients.edit", client.id)} className="text-indigo-600 hover:text-indigo-800 font-medium">Editar</Link>
                                        <button onClick={() => destroy(client.id)} className="text-rose-600 hover:text-rose-800 font-medium">Eliminar</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {clients.length === 0 && (
                        <div className="p-12 text-center text-gray-400 text-sm">No hay clientes registrados todavía.</div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}