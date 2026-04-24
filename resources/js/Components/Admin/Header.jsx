import { router, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { route } from "ziggy-js";

const titleMap = [
    { match: "/admin/dashboard", title: "Resumen general", description: "Una vista rápida del estado del sitio y las gestiones recientes." },
    { match: "/admin/hero", title: "Inicio", description: "Administrá los sliders del comienzo del sitio." },
    { match: "/admin/cms/home", title: "Nosotros en Inicio", description: "Editá el bloque de presentación que aparece dentro del inicio." },
    { match: "/admin/about", title: "Nosotros", description: "Actualizá la página institucional y su contenido principal." },
    { match: "/admin/products", title: "Productos", description: "Gestioná el catálogo que se muestra en el sitio." },
    { match: "/admin/sectors", title: "Sectores", description: "Ordená los sectores y su información visible." },
    { match: "/admin/cms/calidad", title: "Calidad", description: "Mantené el bloque principal de calidad claro y actualizado." },
    { match: "/admin/certificates", title: "Certificados", description: "Subí documentos y logos con vista previa antes de guardar." },
    { match: "/admin/downloads", title: "Descargas", description: "Organizá los archivos que el cliente puede descargar." },
    { match: "/admin/posts", title: "Novedades", description: "Publicá noticias y novedades de forma guiada." },
    { match: "/admin/hr", title: "RRHH", description: "Revisá postulaciones y mantené las vacantes al día." },
    { match: "/admin/clients", title: "Clientes", description: "Actualizá el listado de clientes y sus logos." },
    { match: "/admin/contact", title: "Contacto", description: "Editá datos de contacto y revisá mensajes recibidos." },
    { match: "/admin/comercial/quotations", title: "Cotización", description: "Seguimiento simple de las solicitudes comerciales." },
    { match: "/admin/newsletter", title: "Newsletter", description: "Gestioná suscriptores y envíos desde una sola pantalla." },
    { match: "/admin/seo", title: "Metadatos SEO", description: "Definí cómo se presenta cada página en buscadores y redes." },
];

export default function Header() {
    const page = usePage();
    const { auth } = page.props;
    const currentUrl = page.url ?? "";

    const currentSection = useMemo(
        () => titleMap.find((item) => currentUrl.startsWith(item.match)) ?? titleMap[0],
        [currentUrl]
    );

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-8 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#25A7CA]">
                        Panel Felrro
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                        {currentSection.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {currentSection.description}
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 lg:self-auto">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25A7CA] text-white">
                        <span className="text-sm font-semibold">
                            {auth?.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {auth?.user?.name ?? "Administrador"}
                        </p>
                        <button
                            type="button"
                            onClick={() => router.post(route("admin.logout"))}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-red-500"
                        >
                            <Icon icon="solar:logout-2-outline" width={14} />
                            Salir del panel
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
