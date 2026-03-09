import { usePage, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function Sidebar() {

    const { url, auth } = usePage().props;
    const currentUrl = url ?? "";

    const sections = [

        {
            title: "Panel",
            icon: "solar:home-2-outline",
            children: [
                { title: "Dashboard", icon: "solar:home-outline", url: "/admin/dashboard" },
            ],
        },

        {
            title: "Contenido Web",
            icon: "solar:widget-outline",
            children: [
                { title: "Home", icon: "solar:home-outline", url: "/admin/hero" },
                { title: "Nosotros", icon: "solar:users-group-rounded-outline", url: "/admin/about" },
                { title: "Productos", icon: "solar:box-outline", url: "/admin/products" },
                { title: "Sectores", icon: "solar:buildings-outline", url: "/admin/sectors" },
                { title: "Calidad", icon: "solar:shield-keyhole-outline", url: "/admin/cms/calidad" },
                { title: "Descargas", icon: "solar:download-outline", url: "/admin/downloads" },
                { title: "Novedades", icon: "solar:document-text-outline", url: "/admin/posts" },
            ],
        },

        {
            title: "Comercial",
            icon: "solar:wallet-outline",
            children: [
                { title: "Cotizaciones", icon: "solar:document-add-outline", url: "/admin/comercial/quotations" },
            ],
        },

        {
            title: "RRHH",
            icon: "solar:user-outline",
            children: [
                { title: "Postulaciones", icon: "solar:user-plus-outline", url: route("admin.hr.applications.index") },
                { title: "Puestos", icon: "solar:case-outline", url: route("admin.hr.positions.index") },
                { title: "Sectores", icon: "solar:buildings-outline", url: route("admin.hr.sectors.index") },
            ],
        },

        {
            title: "Clientes",
            icon: "solar:users-group-outline",
            children: [
                { title: "Gestión de Clientes", icon: "solar:user-id-outline", url: "/admin/clients" },
            ],
        },

        {
            title: "Contacto",
            icon: "solar:chat-round-outline",
            children: [
                { title: "Mensajes", icon: "solar:letter-outline", url: "/admin/contact-messages" },
                { title: "Contenido", icon: "solar:map-point-outline", url: "/admin/contacto" },
            ],
        },

        {
            title: "Newsletter",
            icon: "solar:mailbox-outline",
            children: [
                { title: "Suscriptores", icon: "solar:letter-outline", url: "/admin/newsletter" },
            ],
        },

    ];

    return (

        <aside className="w-[272px] h-screen sticky top-0 flex flex-col bg-white border-r border-gray-200">

            {/* HEADER */}

            <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-200">

                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#25A7CA]">
                    <Icon icon="solar:settings-bold" width={18} color="white" />
                </div>

                <div className="leading-tight">
                    <p className="text-sm font-semibold text-gray-800">
                        Panel Admin
                    </p>
                    <p className="text-xs text-gray-400">
                        Felrro S.R.L.
                    </p>
                </div>

            </div>


            {/* NAV */}

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">

                {sections.map(section => (

                    <div key={section.title}>

                        <div className="flex items-center gap-2.5 px-3 py-2">

                            <Icon
                                icon={section.icon}
                                width={16}
                                className="text-gray-400"
                            />

                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                {section.title}
                            </span>

                        </div>

                        <div className="mt-1 pl-3">

                            {section.children.map(item => {

                                const active = currentUrl.startsWith(item.url);

                                return (

                                    <button
                                        key={item.title}
                                        onClick={() => router.visit(item.url)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition relative
                                        ${active
                                                ? "bg-[#25A7CA]/10 text-[#25A7CA] font-medium"
                                                : "text-gray-700 hover:bg-gray-50"}
                                        `}
                                    >

                                        {active && (
                                            <span className="absolute left-0 w-[3px] h-5 bg-[#25A7CA] rounded-r-full" />
                                        )}

                                        <Icon
                                            icon={item.icon}
                                            width={15}
                                            className={active ? "text-[#25A7CA]" : "text-gray-400"}
                                        />

                                        <span className="text-sm truncate">
                                            {item.title}
                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                    </div>

                ))}

            </nav>


            {/* FOOTER */}

            <div className="border-t border-gray-200 p-3">

                {auth?.user && (

                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 mb-2">

                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25A7CA]/20">
                            <Icon icon="solar:user-bold" width={16} className="text-[#25A7CA]" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {auth.user.email}
                            </p>
                        </div>

                    </div>

                )}

                <button
                    onClick={() => router.post("/admin/logout")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition"
                >
                    <Icon icon="solar:logout-2-outline" width={15} />
                    <span className="text-sm font-medium">
                        Cerrar sesión
                    </span>
                </button>

            </div>

        </aside>

    );
}