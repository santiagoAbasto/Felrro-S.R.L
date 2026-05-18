import { router, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";

const navigation = [
    {
        title: "Inicio",
        icon: "solar:home-2-outline",
        children: [
            { title: "Sliders", url: "/admin/hero", icon: "solar:gallery-outline" },
            { title: "Nosotros en Inicio", url: "/admin/cms/home", icon: "solar:widget-2-outline" },
        ],
    },
    {
        title: "Nosotros",
        icon: "solar:users-group-rounded-outline",
        children: [{ title: "Contenido", url: "/admin/about", icon: "solar:pen-2-outline" }],
    },
    {
        title: "Productos",
        icon: "solar:box-outline",
        children: [
            { title: "Listado de productos", url: "/admin/products", icon: "solar:box-minimalistic-outline" },
            { title: "Importar productos", url: "/admin/products-import/aflamex-potencia", icon: "solar:upload-square-outline" },
            { title: "Iconos técnicos", url: "/admin/product-icons", icon: "solar:gallery-favourite-outline" },
            { title: "Categorías", url: "/admin/product-categories", icon: "solar:layers-outline" },
        ],
    },
    {
        title: "Sectores",
        icon: "solar:buildings-outline",
        children: [{ title: "Secciones", url: "/admin/sectors", icon: "solar:buildings-2-outline" }],
    },
    {
        title: "Calidad",
        icon: "solar:shield-keyhole-outline",
        children: [
            { title: "Contenido principal", url: "/admin/cms/calidad", icon: "solar:checklist-minimalistic-outline" },
            { title: "Certificados", url: "/admin/certificates", icon: "solar:diploma-verified-outline" },
        ],
    },
    {
        title: "Descargas",
        icon: "solar:download-outline",
        children: [{ title: "Archivos disponibles", url: "/admin/downloads", icon: "solar:document-text-outline" }],
    },
    {
        title: "Novedades",
        icon: "solar:document-add-outline",
        children: [{ title: "Publicaciones", url: "/admin/posts", icon: "solar:notes-outline" }],
    },
    {
        title: "RRHH",
        icon: "solar:case-outline",
        children: [
            { title: "Postulaciones", url: "/admin/hr/applications", icon: "solar:user-plus-outline" },
            { title: "Puestos", url: "/admin/hr/positions", icon: "solar:case-round-outline" },
            { title: "Sectores internos", url: "/admin/hr/sectors", icon: "solar:buildings-outline" },
        ],
    },
    {
        title: "Clientes",
        icon: "solar:users-group-two-rounded-outline",
        children: [{ title: "Listado de clientes", url: "/admin/clients", icon: "solar:user-id-outline" }],
    },
    {
        title: "Contacto",
        icon: "solar:chat-round-outline",
        children: [
            { title: "Contenido", url: "/admin/contacto", icon: "solar:map-point-wave-outline" },
            { title: "Mensajes recibidos", url: "/admin/contact-messages", icon: "solar:letter-outline" },
        ],
    },
    {
        title: "Cotización",
        icon: "solar:document-add-outline",
        children: [{ title: "Solicitudes", url: "/admin/comercial/quotations", icon: "solar:clipboard-text-outline" }],
    },
    {
        title: "Newsletter",
        icon: "solar:mailbox-outline",
        children: [
            { title: "Suscriptores y envíos", url: "/admin/newsletter", icon: "solar:inbox-archive-outline" },
        ],
    },
    {
        title: "Configuración",
        icon: "solar:settings-outline",
        children: [
            { title: "WhatsApp flotante", url: "/admin/settings/floating-whatsapp", icon: "solar:smartphone-update-outline" },
            { title: "Footer", url: "/admin/settings/footer", icon: "solar:sidebar-code-outline" },
        ],
    },
    {
        title: "Metadatos SEO",
        icon: "solar:global-outline",
        children: [{ title: "Configuración", url: "/admin/seo", icon: "solar:settings-outline" }],
    },
];

export default function Sidebar() {
    const page = usePage();
    const { auth } = page.props;
    const currentUrl = page.url ?? "";

    const defaultOpen = useMemo(
        () =>
            navigation.reduce((accumulator, section) => {
                accumulator[section.title] = section.children.some((item) => currentUrl.startsWith(item.url)) || section.title === "Inicio";
                return accumulator;
            }, {}),
        [currentUrl]
    );

    const [openSections, setOpenSections] = useState(defaultOpen);

    const toggleSection = (title) => {
        setOpenSections((current) => ({
            ...current,
            [title]: !current[title],
        }));
    };

    return (
        <aside className="sticky top-0 flex h-screen w-[320px] flex-col border-r border-slate-200 bg-[#0f172a] text-slate-100">
            <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25A7CA] text-white shadow-lg shadow-[#25A7CA]/25">
                        <Icon icon="solar:settings-bold" width={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Panel de gestión</p>
                        <p className="text-xs text-slate-400">Felrro</p>
                    </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                    Todo el contenido del sitio se administra desde acá, con una guía simple y ordenada.
                </p>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
                <button
                    type="button"
                    onClick={() => router.visit("/admin/dashboard")}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                        currentUrl.startsWith("/admin/dashboard")
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-200 hover:bg-white/5"
                    }`}
                >
                    <Icon icon="solar:chart-2-outline" width={18} />
                    <span className="text-sm font-semibold">Resumen</span>
                </button>

                {navigation.map((section) => {
                    const isSectionActive = section.children.some((item) => currentUrl.startsWith(item.url));
                    const isOpen = openSections[section.title];

                    return (
                        <div key={section.title} className="rounded-[22px] border border-white/8 bg-white/[0.03]">
                            <button
                                type="button"
                                onClick={() => toggleSection(section.title)}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                                    isSectionActive ? "text-white" : "text-slate-200 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon icon={section.icon} width={18} />
                                    <span className="text-sm font-semibold">{section.title}</span>
                                </span>
                                <Icon
                                    icon={isOpen ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"}
                                    width={16}
                                    className="text-slate-400"
                                />
                            </button>

                            {isOpen ? (
                                <div className="space-y-1 px-3 pb-3">
                                    {section.children.map((item) => {
                                        const active = currentUrl.startsWith(item.url);

                                        return (
                                            <button
                                                key={item.title}
                                                type="button"
                                                onClick={() => router.visit(item.url)}
                                                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                                                    active
                                                        ? "bg-[#25A7CA] text-white shadow-sm shadow-[#25A7CA]/20"
                                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                                }`}
                                            >
                                                <Icon icon={item.icon} width={16} />
                                                <span>{item.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                {auth?.user ? (
                    <div className="mb-3 rounded-[22px] border border-white/10 bg-white/5 p-3">
                        <p className="text-sm font-semibold text-white">{auth.user.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{auth.user.email}</p>
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={() => router.post("/admin/logout")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                    <Icon icon="solar:logout-2-outline" width={16} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
