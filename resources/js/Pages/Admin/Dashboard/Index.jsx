import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Icon } from "@iconify/react";
import { AdminPageHeader } from "@/Components/Admin/FormElements";

const seriesPalette = {
    traffic: {
        label: "Sesiones",
        color: "#0f172a",
        bg: "bg-slate-900",
    },
    commercial: {
        label: "Cotizaciones",
        color: "#25A7CA",
        bg: "bg-[#25A7CA]",
    },
    messages: {
        label: "Mensajes",
        color: "#22c55e",
        bg: "bg-emerald-500",
    },
    newsletter: {
        label: "Newsletter",
        color: "#f59e0b",
        bg: "bg-amber-500",
    },
};

export default function Dashboard({
    stats,
    overview,
    traffic,
    activity,
    latestQuotations = [],
    latestMessages = [],
}) {
    const growth = overview?.growth_sessions_last_7_days ?? {
        percentage: 0,
        direction: "neutral",
        label: "Sin variación",
    };

    const overviewCards = [
        {
            title: "Sesiones activas ahora",
            value: overview?.active_sessions ?? 0,
            helper: "Últimos 30 minutos",
            icon: "solar:pulse-2-bold-duotone",
            tone: "from-slate-900 via-slate-800 to-slate-700",
        },
        {
            title: "Tráfico de hoy",
            value: overview?.sessions_today ?? 0,
            helper: `${overview?.unique_visitors_30_days ?? 0} IPs únicas en 30 días`,
            icon: "solar:graph-up-bold-duotone",
            tone: "from-[#25A7CA] via-[#1f9aba] to-[#127c99]",
        },
        {
            title: "Mensajes por responder",
            value: overview?.unread_messages ?? 0,
            helper: "Pendientes de lectura",
            icon: "solar:chat-round-dots-bold-duotone",
            tone: "from-emerald-600 via-emerald-500 to-teal-500",
        },
        {
            title: "Suscriptores activos",
            value: overview?.newsletter_active ?? 0,
            helper: "Base de newsletter habilitada",
            icon: "solar:letter-bold-duotone",
            tone: "from-amber-500 via-orange-500 to-rose-500",
        },
    ];

    const structureCards = [
        { label: "Productos", value: stats?.products ?? 0, icon: "solar:box-bold-duotone" },
        { label: "Categorías", value: stats?.categories ?? 0, icon: "solar:widget-5-bold-duotone" },
        { label: "Novedades", value: stats?.posts ?? 0, icon: "solar:document-add-bold-duotone" },
        { label: "Cotizaciones", value: stats?.quotations ?? 0, icon: "solar:cart-large-4-bold-duotone" },
        { label: "Mensajes", value: stats?.messages ?? 0, icon: "solar:chat-round-like-bold-duotone" },
        { label: "Newsletter", value: stats?.newsletterSubscribers ?? 0, icon: "solar:mailbox-bold-duotone" },
    ];

    const quickLinks = [
        { label: "Productos", routeName: "admin.products.index", icon: "solar:box-outline" },
        { label: "Categorías", routeName: "admin.product-categories.index", icon: "solar:widget-4-outline" },
        { label: "Cotizaciones", routeName: "admin.comercial.quotations.index", icon: "solar:document-text-outline" },
        { label: "Mensajes", routeName: "admin.contact-messages.index", icon: "solar:chat-round-outline" },
        { label: "Contacto", routeName: "admin.contacto.edit", icon: "solar:map-point-outline" },
        { label: "SEO", routeName: "admin.seo.index", icon: "solar:global-outline" },
    ];

    return (
        <AdminLayout>
            <Head title="Resumen" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Resumen ejecutivo"
                    title="Panel de control comercial y de tráfico"
                    description="Una vista profesional del rendimiento reciente del sitio, el movimiento comercial y la salud general del contenido. Todo sale de datos reales del proyecto."
                    actions={
                        <>
                            <HeaderAction
                                href={route("admin.comercial.quotations.index")}
                                icon="solar:cart-large-4-outline"
                                label="Ver cotizaciones"
                            />
                            <HeaderAction
                                href={route("admin.contact-messages.index")}
                                icon="solar:chat-round-outline"
                                label="Ver mensajes"
                                tone="secondary"
                            />
                        </>
                    }
                />

                <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-0 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
                        <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,167,202,0.18),_transparent_40%),linear-gradient(135deg,_#0f172a,_#1e293b_55%,_#0f766e)] p-8 text-white xl:border-b-0 xl:border-r xl:border-slate-100">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Rendimiento reciente
                                </div>

                                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    {overview?.top_device ?? "Sin datos"} lidera el tráfico y{" "}
                                    {(overview?.sessions_last_7_days ?? 0).toLocaleString("es-AR")} sesiones
                                    movieron la última semana.
                                </h2>

                                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                                    El tablero cruza actividad web, demanda comercial y señales de uso
                                    para ayudarte a decidir qué sección conviene reforzar, responder o
                                    actualizar primero.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    <HeroMetric
                                        label="Dispositivo más usado"
                                        value={overview?.top_device ?? "Sin datos"}
                                        hint="Preferencia dominante"
                                    />
                                    <HeroMetric
                                        label="Navegador líder"
                                        value={overview?.top_browser ?? "Sin datos"}
                                        hint="Compatibilidad principal"
                                    />
                                    <HeroMetric
                                        label="Sistema más frecuente"
                                        value={overview?.top_os ?? "Sin datos"}
                                        hint="Base tecnológica"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {overviewCards.map((card) => (
                                    <OverviewCard key={card.title} {...card} />
                                ))}
                            </div>

                            <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                            Comparativa semanal
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-slate-900">
                                            {growth.label}
                                        </p>
                                    </div>
                                    <GrowthBadge growth={growth} />
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <MiniSummary
                                        label="Sesiones autenticadas"
                                        value={overview?.authenticated_sessions ?? 0}
                                        hint="Usuarios con acceso"
                                    />
                                    <MiniSummary
                                        label="Sesiones anónimas"
                                        value={overview?.anonymous_sessions ?? 0}
                                        hint="Visitantes públicos"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    {structureCards.map((item) => (
                        <StructureCard key={item.label} {...item} />
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
                    <PanelCard
                        title="Tráfico y demanda de los últimos 14 días"
                        description="La línea más oscura muestra sesiones. El resto ayuda a cruzar visitas con interés comercial y captación."
                    >
                        <TrendChart
                            labels={activity?.traffic_timeline?.map((item) => item.label) ?? []}
                            series={[
                                {
                                    key: "traffic",
                                    label: seriesPalette.traffic.label,
                                    color: seriesPalette.traffic.color,
                                    values: activity?.traffic_timeline?.map((item) => item.value) ?? [],
                                },
                                {
                                    key: "commercial",
                                    label: seriesPalette.commercial.label,
                                    color: seriesPalette.commercial.color,
                                    values: activity?.commercial_timeline?.map((item) => item.value) ?? [],
                                },
                                {
                                    key: "messages",
                                    label: seriesPalette.messages.label,
                                    color: seriesPalette.messages.color,
                                    values: activity?.messages_timeline?.map((item) => item.value) ?? [],
                                },
                                {
                                    key: "newsletter",
                                    label: seriesPalette.newsletter.label,
                                    color: seriesPalette.newsletter.color,
                                    values: activity?.newsletter_timeline?.map((item) => item.value) ?? [],
                                },
                            ]}
                        />
                    </PanelCard>

                    <PanelCard
                        title="Distribución del tráfico"
                        description="Sirve para ver rápido dónde conviene priorizar compatibilidad y pruebas."
                    >
                        <div className="space-y-5">
                            <DistributionBlock
                                title="Dispositivos"
                                items={traffic?.devices ?? []}
                                emptyText="Todavía no hay sesiones suficientes para armar la distribución."
                            />
                            <DistributionBlock title="Navegadores" items={traffic?.browsers ?? []} />
                            <DistributionBlock title="Sistemas operativos" items={traffic?.operating_systems ?? []} />
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
                    <PanelCard
                        title="Últimas cotizaciones"
                        description="Prioridad comercial inmediata para seguimiento."
                    >
                        {latestQuotations.length === 0 ? (
                            <EmptyPanel text="Todavía no llegaron cotizaciones recientes." />
                        ) : (
                            <div className="space-y-3">
                                {latestQuotations.map((quotation) => (
                                    <ActivityRow
                                        key={quotation.id}
                                        title={quotation.empresa || quotation.nombre || `Cotización #${quotation.id}`}
                                        subtitle={`${quotation.email || "Sin email"} · ${quotation.items_count ?? 0} productos`}
                                        meta={formatDate(quotation.created_at)}
                                        status="Pendiente"
                                        href={route("admin.comercial.quotations.show", quotation.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </PanelCard>

                    <PanelCard
                        title="Últimos mensajes"
                        description="Entrada rápida para atención comercial y consultas generales."
                    >
                        {latestMessages.length === 0 ? (
                            <EmptyPanel text="Todavía no hay mensajes recientes." />
                        ) : (
                            <div className="space-y-3">
                                {latestMessages.map((message) => (
                                    <ActivityRow
                                        key={message.id}
                                        title={message.nombre || "Consulta web"}
                                        subtitle={message.email || "Sin email"}
                                        meta={formatDate(message.created_at)}
                                        status={message.is_read ? "Leído" : "Nuevo"}
                                        href={route("admin.contact-messages.show", message.id)}
                                        statusTone={message.is_read ? "neutral" : "fresh"}
                                    />
                                ))}
                            </div>
                        )}
                    </PanelCard>

                    <PanelCard
                        title="Redes activas detectadas"
                        description="Las IPs se muestran enmascaradas para cuidar seguridad y privacidad."
                    >
                        <div className="space-y-4">
                            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-semibold text-amber-800">
                                    {traffic?.location_notice?.title}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-amber-700">
                                    {traffic?.location_notice?.description}
                                </p>
                            </div>

                            {traffic?.top_networks?.length ? (
                                <div className="space-y-3">
                                    {traffic.top_networks.map((network) => (
                                        <div
                                            key={network.label}
                                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                                    <Icon icon="solar:server-square-bold-duotone" width={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {network.label}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Red reciente detectada
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                                {network.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyPanel text="Todavía no hay sesiones recientes para mostrar redes activas." />
                            )}
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
                    <PanelCard
                        title="Accesos rápidos"
                        description="Entradas directas a las áreas con más movimiento operativo."
                    >
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {quickLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={route(item.routeName)}
                                    className="group rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-[#25A7CA]/30 hover:bg-white hover:shadow-sm"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#25A7CA] shadow-sm transition group-hover:bg-[#25A7CA] group-hover:text-white">
                                        <Icon icon={item.icon} width={20} />
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-slate-900">{item.label}</p>
                                    <p className="mt-1 text-xs text-slate-400">Entrar a gestionar</p>
                                </Link>
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard
                        title="Lectura ejecutiva"
                        description="Síntesis rápida para detectar foco operativo sin recorrer todo el panel."
                    >
                        <div className="space-y-4">
                            <InsightCard
                                icon="solar:monitor-bold-duotone"
                                title="Canal dominante"
                                body={`El tráfico reciente se concentra más en ${overview?.top_device ?? "Sin datos"}, por eso conviene validar primero esa experiencia al publicar cambios sensibles.`}
                            />
                            <InsightCard
                                icon="solar:inbox-in-bold-duotone"
                                title="Carga comercial"
                                body={`Hoy hay ${overview?.pending_quotations ?? 0} cotizaciones acumuladas y ${overview?.unread_messages ?? 0} mensajes pendientes de revisar.`}
                            />
                            <InsightCard
                                icon="solar:shield-check-bold-duotone"
                                title="Criterio de seguridad"
                                body="La vista ejecutiva no expone ubicaciones exactas ni datos personales sensibles. El resumen muestra redes enmascaradas y métricas agregadas."
                            />
                        </div>
                    </PanelCard>
                </section>
            </div>
        </AdminLayout>
    );
}

function HeaderAction({ href, icon, label, tone = "primary" }) {
    const toneClass =
        tone === "secondary"
            ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            : "border-[#25A7CA] bg-[#25A7CA] text-white hover:bg-[#1c96b8]";

    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${toneClass}`}
        >
            <Icon icon={icon} width={18} />
            {label}
        </Link>
    );
}

function HeroMetric({ label, value, hint }) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            <p className="mt-1 text-xs text-white/60">{hint}</p>
        </div>
    );
}

function OverviewCard({ title, value, helper, icon, tone }) {
    return (
        <div className={`rounded-[26px] bg-gradient-to-br ${tone} p-5 text-white shadow-sm`}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">{formatNumber(value)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Icon icon={icon} width={22} />
                </div>
            </div>
            <p className="mt-4 text-sm text-white/75">{helper}</p>
        </div>
    );
}

function GrowthBadge({ growth }) {
    const toneClass =
        growth.direction === "up"
            ? "bg-emerald-100 text-emerald-700"
            : growth.direction === "down"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500";

    const icon =
        growth.direction === "up"
            ? "solar:arrow-to-top-left-bold"
            : growth.direction === "down"
                ? "solar:arrow-to-down-right-bold"
                : "solar:minus-circle-bold";

    return (
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${toneClass}`}>
            <Icon icon={icon} width={16} />
            {growth.percentage}%
        </div>
    );
}

function MiniSummary({ label, value, hint }) {
    return (
        <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(value)}</p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
    );
}

function StructureCard({ label, value, icon }) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25A7CA]/10 text-[#25A7CA]">
                    <Icon icon={icon} width={22} />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-900">{formatNumber(value)}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                </div>
            </div>
        </div>
    );
}

function PanelCard({ title, description, children }) {
    return (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                {description ? <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p> : null}
            </div>
            {children}
        </section>
    );
}

function TrendChart({ labels = [], series = [] }) {
    const width = 720;
    const height = 280;
    const paddingX = 16;
    const paddingY = 20;
    const flattened = series.flatMap((item) => item.values);
    const maxValue = Math.max(...flattened, 1);

    const pointsForSeries = (values) =>
        values
            .map((value, index) => {
                const x =
                    paddingX +
                    (labels.length <= 1 ? 0 : (index / (labels.length - 1)) * (width - paddingX * 2));
                const y = height - paddingY - (value / maxValue) * (height - paddingY * 2);
                return `${x},${y}`;
            })
            .join(" ");

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((step) => {
        const y = height - paddingY - step * (height - paddingY * 2);
        return {
            y,
            value: Math.round(maxValue * step),
        };
    });

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-3">
                {series.map((item) => (
                    <div key={item.key} className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] p-4">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] w-full">
                    {gridLines.map((line) => (
                        <g key={line.y}>
                            <line
                                x1={paddingX}
                                x2={width - paddingX}
                                y1={line.y}
                                y2={line.y}
                                stroke="#e2e8f0"
                                strokeDasharray="4 6"
                            />
                            <text x={paddingX + 2} y={line.y - 6} fontSize="11" fill="#94a3b8">
                                {line.value}
                            </text>
                        </g>
                    ))}

                    {series.map((item) => (
                        <polyline
                            key={item.key}
                            points={pointsForSeries(item.values)}
                            fill="none"
                            stroke={item.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:grid-cols-7 xl:grid-cols-14">
                    {labels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DistributionBlock({ title, items = [], emptyText = "Sin datos todavía." }) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="text-xs text-slate-400">
                    {items.reduce((acc, item) => acc + (item.value ?? 0), 0)} registros
                </p>
            </div>

            {items.length === 0 ? (
                <EmptyPanel text={emptyText} />
            ) : (
                <div className="space-y-3">
                    {items.slice(0, 5).map((item, index) => (
                        <div key={item.label} className="space-y-1.5">
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="font-medium text-slate-700">{item.label}</span>
                                <span className="text-slate-400">
                                    {item.value} · {item.percentage}%
                                </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full rounded-full ${
                                        index === 0
                                            ? "bg-slate-900"
                                            : index === 1
                                                ? "bg-[#25A7CA]"
                                                : index === 2
                                                    ? "bg-emerald-500"
                                                    : index === 3
                                                        ? "bg-amber-500"
                                                        : "bg-slate-400"
                                    }`}
                                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ActivityRow({ title, subtitle, meta, status, href, statusTone = "default" }) {
    const statusClass =
        statusTone === "fresh"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : statusTone === "neutral"
                ? "bg-slate-50 text-slate-600 border-slate-200"
                : "bg-[#25A7CA]/10 text-[#117a98] border-[#25A7CA]/20";

    return (
        <Link
            href={href}
            className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 transition hover:border-[#25A7CA]/25 hover:bg-white hover:shadow-sm"
        >
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 truncate text-sm text-slate-500">{subtitle}</p>
                <p className="mt-2 text-xs text-slate-400">{meta}</p>
            </div>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
                {status}
            </span>
        </Link>
    );
}

function InsightCard({ icon, title, body }) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#25A7CA] shadow-sm">
                    <Icon icon={icon} width={20} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{body}</p>
                </div>
            </div>
        </div>
    );
}

function EmptyPanel({ text }) {
    return (
        <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-400">
            {text}
        </div>
    );
}

function formatNumber(value) {
    return Number(value ?? 0).toLocaleString("es-AR");
}

function formatDate(value) {
    if (!value) {
        return "Sin fecha";
    }

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}
