import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import { AdminPageHeader, AdminSectionCard } from "@/Components/Admin/FormElements";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function Index({ messages }) {
    const { flash = {} } = usePage().props;
    const rows = messages?.data || [];
    const unreadCount = rows.filter((message) => !message.is_read).length;

    const destroy = (message) => {
        if (!confirm(`¿Querés eliminar el mensaje de ${message.nombre}?`)) {
            return;
        }

        router.delete(route("admin.contact-messages.destroy", message.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Mensajes recibidos" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Contacto"
                    title="Mensajes recibidos"
                    description="Revisá las consultas que llegan desde el formulario público, respondé por correo y eliminá las que ya no necesitás."
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Mensajes en esta página" value={rows.length} icon="solar:letter-outline" />
                    <StatCard title="Nuevos" value={unreadCount} icon="solar:unread-outline" tone="accent" />
                    <StatCard title="Total registrado" value={messages?.total ?? rows.length} icon="solar:archive-outline" />
                </div>

                <AdminSectionCard
                    title="Bandeja de contacto"
                    description="Al abrir un mensaje se marca como leído automáticamente."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Contacto</th>
                                    <th className="px-4 py-3">Empresa</th>
                                    <th className="px-4 py-3">Mensaje</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {rows.length ? rows.map((message) => (
                                    <tr key={message.id}>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-slate-700">{message.nombre}</p>
                                            <a
                                                href={`mailto:${message.email}`}
                                                className="mt-1 block text-xs font-medium text-[#117a98] hover:text-[#25A7CA]"
                                            >
                                                {message.email}
                                            </a>
                                            {message.telefono ? (
                                                <p className="mt-1 text-xs text-slate-400">{message.telefono}</p>
                                            ) : null}
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            {message.empresa || "-"}
                                        </td>
                                        <td className="max-w-md px-4 py-4">
                                            <p className="line-clamp-2 text-slate-600">
                                                {message.mensaje}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    message.is_read
                                                        ? "bg-slate-200 text-slate-500"
                                                        : "bg-[#25A7CA]/10 text-[#117a98]"
                                                }`}
                                            >
                                                {message.is_read ? "Leído" : "Nuevo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            {formatDate(message.created_at)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route("admin.contact-messages.show", message.id)}
                                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Ver
                                                </Link>
                                                <a
                                                    href={`mailto:${message.email}?subject=Respuesta a tu consulta - Felrro`}
                                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Responder
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => destroy(message)}
                                                    className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                            No hay mensajes recibidos todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {messages?.links?.length > 3 ? (
                        <div className="flex flex-wrap gap-2">
                            {messages.links.map((link, index) => (
                                <button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                    className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                                        link.active
                                            ? "border-[#25A7CA] bg-[#25A7CA] text-white"
                                            : "border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    ) : null}
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, tone = "default" }) {
    const className = tone === "accent"
        ? "border-[#25A7CA]/20 bg-[#25A7CA]/[0.05] text-[#117a98]"
        : "border-slate-200 bg-white text-slate-900";

    return (
        <div className={`rounded-[24px] border p-5 shadow-sm ${className}`}>
            <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                    {title}
                </p>
                <Icon icon={icon} width={18} />
            </div>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
        </div>
    );
}
