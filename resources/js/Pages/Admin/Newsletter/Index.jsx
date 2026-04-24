import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState } from "react";
import Toast from "@/Components/Toast";
import {
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
} from "@/Components/Admin/FormElements";

export default function Index({ subscribers, filters, activeCount }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");

    const { data, setData, post, processing, errors } = useForm({
        subject: "",
        message: "",
    });

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route("admin.newsletter.index"), { search }, { preserveState: true });
    };

    const toggle = (id) => {
        router.patch(route("admin.newsletter.toggle", id));
    };

    const destroy = (id) => {
        if (confirm("¿Querés eliminar este suscriptor?")) {
            router.delete(route("admin.newsletter.destroy", id));
        }
    };

    const sendNewsletter = (event) => {
        event.preventDefault();
        post(route("admin.newsletter.store"));
    };

    return (
        <AdminLayout>
            <Head title="Newsletter" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Newsletter"
                    title="Suscriptores y envíos"
                    description="Desde esta pantalla podés preparar un envío y revisar quiénes están activos para recibirlo."
                />

                <AdminSectionCard
                    title="Nuevo envío"
                    description={`El mensaje se enviará a ${activeCount} suscriptor${activeCount === 1 ? "" : "es"} activo${activeCount === 1 ? "" : "s"}.`}
                >
                    <form onSubmit={sendNewsletter} className="space-y-6">
                        <AdminTextInput
                            label="Asunto"
                            value={data.subject}
                            onChange={(value) => setData("subject", value)}
                            placeholder="Ej: Novedades de este mes"
                            error={errors.subject}
                        />

                        <AdminRichTextarea
                            label="Mensaje"
                            value={data.message}
                            onChange={(value) => setData("message", value)}
                            placeholder="Escribí el contenido del envío con un tono claro y cercano."
                            error={errors.message}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setData({ subject: "", message: "" })}
                                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                            >
                                Limpiar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-2xl bg-[#25A7CA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                            >
                                {processing ? "Enviando..." : "Enviar newsletter"}
                            </button>
                        </div>
                    </form>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Suscriptores"
                    description="Usá el buscador para encontrar rápido un correo o revisar el estado de un registro."
                >
                    <form onSubmit={submitSearch} className="flex flex-col gap-3 md:flex-row">
                        <input
                            type="text"
                            placeholder="Buscar por correo o número de registro"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10 md:max-w-md"
                        />
                        <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                            Buscar
                        </button>
                    </form>

                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">N°</th>
                                    <th className="px-4 py-3">Correo</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {subscribers.data.map((sub) => (
                                    <tr key={sub.id}>
                                        <td className="px-4 py-3 text-slate-500">{sub.id}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{sub.email}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => toggle(sub.id)}
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    sub.is_active
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-200 text-slate-500"
                                                }`}
                                            >
                                                {sub.is_active ? "Activo" : "Pausado"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => destroy(sub.id)}
                                                className="text-sm font-semibold text-red-500 transition hover:text-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}
