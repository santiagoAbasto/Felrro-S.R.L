import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState } from "react";
import Toast from "@/Components/Toast";

export default function Index({ subscribers, filters, activeCount }) {

    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing } = useForm({
        subject: "",
        message: ""
    });

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.newsletter.index'), { search }, { preserveState: true });
    };

    const toggle = (id) => {
        router.patch(route('admin.newsletter.toggle', id));
    };

    const destroy = (id) => {
        if(confirm("¿Eliminar suscriptor?")){
            router.delete(route('admin.newsletter.destroy', id));
        }
    };

    const sendNewsletter = (e) => {
        e.preventDefault();
        post(route("admin.newsletter.store"));
    };

    return (
        <AdminLayout>
            <Head title="Newsletter" />

            {/* TOAST */}
            <Toast message={flash.success} type="success" />

            <div className="p-10 space-y-8">

                <h1 className="text-2xl font-bold">Newsletter</h1>

                {/* FORM */}
                <div className="bg-white shadow rounded-xl p-8 space-y-6">

                    <h2 className="text-lg font-semibold">
                        Enviar Newsletter
                    </h2>

                    <form onSubmit={sendNewsletter} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Asunto *
                            </label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData("subject", e.target.value)}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#25A7CA] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mensaje *
                            </label>
                            <textarea
                                rows="6"
                                value={data.message}
                                onChange={(e) => setData("message", e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] outline-none"
                            />
                        </div>

                        <p className="text-sm text-gray-500">
                            Se enviará a <strong>{activeCount}</strong> suscriptores activos.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setData({ subject:"", message:"" })}
                                className="px-4 py-2 bg-gray-200 rounded-lg"
                            >
                                Cancelar
                            </button>

                            <button
                                disabled={processing}
                                className="px-6 py-2 bg-[#25A7CA] text-white rounded-lg hover:bg-[#1f95b3] transition"
                            >
                                {processing ? "Enviando..." : "Enviar Newsletter"}
                            </button>
                        </div>

                    </form>
                </div>

                {/* BUSCADOR */}
                <form onSubmit={submitSearch} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por email o ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-80"
                    />
                    <button className="bg-gray-800 text-white px-4 rounded-lg">
                        Buscar
                    </button>
                </form>

                {/* TABLA */}
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-4">ID</th>
                                <th>Email</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {subscribers.data.map(sub => (
                                <tr key={sub.id} className="border-t">
                                    <td className="p-4">{sub.id}</td>
                                    <td>{sub.email}</td>
                                    <td>
                                        <button
                                            onClick={() => toggle(sub.id)}
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                sub.is_active
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {sub.is_active ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => destroy(sub.id)}
                                            className="text-red-600"
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminLayout>
    );
}