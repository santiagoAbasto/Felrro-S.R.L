import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Dashboard({
    stats,
    latestQuotations = [],
    latestMessages = []
}) {
    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="p-10 space-y-12 bg-gray-50 min-h-screen">

                {/* ===========================
                    HEADER
                ============================ */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Resumen general del sistema Felrro
                    </p>
                </div>

                {/* ===========================
                    TARJETAS ESTADÍSTICAS
                ============================ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard title="Productos" value={stats.products} />
                    <StatCard title="Categorías" value={stats.categories} />
                    <StatCard title="Posts" value={stats.posts} />
                    <StatCard title="Cotizaciones" value={stats.quotations} />
                    <StatCard title="Mensajes" value={stats.messages} />
                </div>

                {/* ===========================
                    SECCIÓN INFERIOR
                ============================ */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                    {/* Últimas Cotizaciones */}
                    <PanelCard title="Últimas Cotizaciones">
                        {latestQuotations.length === 0 ? (
                            <EmptyState text="No hay cotizaciones recientes." />
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {latestQuotations.map(q => (
                                    <li key={q.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded transition">
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                Cotización #{q.id}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {q.created_at}
                                            </div>
                                        </div>

                                        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                            Nueva
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </PanelCard>

                    {/* Últimos Mensajes */}
                    <PanelCard title="Últimos Mensajes">
                        {latestMessages.length === 0 ? (
                            <EmptyState text="No hay mensajes recientes." />
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {latestMessages.map(m => (
                                    <li key={m.id} className="py-4 hover:bg-gray-50 px-2 rounded transition">
                                        <div className="font-semibold text-gray-800">
                                            {m.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {m.email}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </PanelCard>

                </div>

                {/* ===========================
                    ACCESOS RÁPIDOS
                ============================ */}
                <PanelCard title="Accesos rápidos">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <QuickLink label="Editar Home" routeName="admin.pages.index" />
                        <QuickLink label="Productos" routeName="admin.products.index" />
                        <QuickLink label="Posts" routeName="admin.posts.index" />
                        <QuickLink label="Cotizaciones" routeName="admin.comercial.quotations.index" />
                    </div>
                </PanelCard>

            </div>
        </AdminLayout>
    );
}


/* ===========================
    COMPONENTES INTERNOS
=========================== */

function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="text-gray-500 text-sm uppercase tracking-wide">
                {title}
            </div>
            <div className="text-3xl font-bold mt-3 text-gray-800">
                {value ?? 0}
            </div>
        </div>
    );
}

function PanelCard({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {title}
            </h2>
            {children}
        </div>
    );
}

function QuickLink({ label, routeName }) {
    return (
        <Link
            href={route(routeName)}
            className="bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg p-5 text-center font-medium transition-all duration-200"
        >
            {label}
        </Link>
    );
}

function EmptyState({ text }) {
    return (
        <div className="text-gray-400 text-sm italic">
            {text}
        </div>
    );
}