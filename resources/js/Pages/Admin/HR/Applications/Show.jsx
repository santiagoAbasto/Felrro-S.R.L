import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Show({ application }) {

    return (
        <AdminLayout>
            <Head title="Detalle Postulación" />

            <div className="p-8 min-h-screen bg-gray-50 font-[Montserrat]">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <Link
                            href={route("admin.hr.applications.index")}
                            className="inline-flex items-center gap-2 text-[#25A7CA] text-sm font-medium no-underline hover:opacity-70 transition-opacity mb-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5"
                                    stroke="#25A7CA" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a Postulaciones
                        </Link>
                        <h1 className="text-3xl font-bold text-[#101010] leading-tight m-0">
                            {application.full_name}
                        </h1>
                    </div>

                    {/* BADGES ESTADO */}
                    <div className="flex gap-2 flex-wrap">
                        {application.is_reviewed ? (
                            <span className="inline-flex px-3 py-1.5 rounded-full bg-[#e6f9f1] text-[#1a7a4a] text-xs font-semibold">
                                ✓ Revisado
                            </span>
                        ) : (
                            <span className="inline-flex px-3 py-1.5 rounded-full bg-[#fff8e1] text-[#b45309] text-xs font-semibold">
                                Pendiente revisión
                            </span>
                        )}
                        {application.is_contacted && (
                            <span className="inline-flex px-3 py-1.5 rounded-full bg-[#e8f4fd] text-[#1a5e8a] text-xs font-semibold">
                                ✓ Contactado
                            </span>
                        )}
                    </div>
                </div>

                {/* DATOS PERSONALES */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-[#DDDDE0]">
                        <h2 className="text-base font-bold text-[#101010] m-0">
                            Datos personales
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                        <Field label="Email" value={application.email} />
                        <Field label="Teléfono" value={application.phone} />
                        <Field label="Tipo de documento" value={application.document_type} />
                        <Field label="Número de documento" value={application.document_number} />
                        <Field label="Género" value={application.genero} />
                        <Field label="Nacionalidad" value={application.nacionalidad} />
                        <Field label="País" value={application.country} />
                        <Field label="Provincia" value={application.provincia} />
                        <Field label="Localidad" value={application.localidad} />
                        <Field label="Fecha de nacimiento" value={application.fecha_nacimiento} />
                        <Field label="Puesto aplicado" value={application.position?.title?.es ?? "—"} />
                        <Field label="Sector" value={application.sector?.name?.es ?? "—"} />

                    </div>
                </div>

                {/* ARCHIVOS */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-[#DDDDE0]">
                        <h2 className="text-base font-bold text-[#101010] m-0">
                            Archivos adjuntos
                        </h2>
                    </div>
                    <div className="p-6 flex gap-4 flex-wrap">

                        <a
                            href={route("admin.hr.applications.downloadCv", application.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25A7CA] hover:bg-[#1f93b3] text-white text-sm font-semibold no-underline transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"
                                    stroke="white" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Descargar CV
                        </a>

                        {application.cover_letter_url && (
                            <a
                                href={route("admin.hr.applications.downloadCoverLetter", application.id)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#25A7CA] text-[#25A7CA] hover:bg-[#25A7CA] hover:text-white text-sm font-semibold no-underline transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"
                                    stroke="currentColor" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Descargar Carta
                            </a>
                        )}

                    </div>
                </div>

                {/* ACCIONES */}
                {(!application.is_reviewed || !application.is_contacted) && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#DDDDE0]">
                            <h2 className="text-base font-bold text-[#101010] m-0">
                                Acciones
                            </h2>
                        </div>
                        <div className="p-6 flex gap-4 flex-wrap">

                            {!application.is_reviewed && (
                                <button
                                    onClick={() => router.post(
                                        route("admin.hr.applications.markReviewed", application.id)
                                    )}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e6f9f1] hover:bg-[#c8f0e0] text-[#1a7a4a] text-sm font-semibold border-none cursor-pointer transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="#1a7a4a"
                                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Marcar como Revisado
                                </button>
                            )}

                            {!application.is_contacted && (
                                <button
                                    onClick={() => router.post(
                                        route("admin.hr.applications.markContacted", application.id)
                                    )}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fff8e1] hover:bg-[#ffedb0] text-[#b45309] text-sm font-semibold border-none cursor-pointer transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="none">
                                        <path d="M22 16.92V19.92C22 20.4835 21.7754 21.0235 21.3753 21.4126C20.9752 21.8018 20.4344 22.0059 19.87 21.99C16.7429 21.6643 13.7401 20.5906 11.12 18.86C8.67638 17.2788 6.62342 15.2258 5.04199 12.78C3.30597 10.1477 2.23257 7.12923 1.91 3.98998C1.89408 3.42696 2.09647 2.88793 2.48395 2.48891C2.87143 2.08988 3.40889 1.88519 3.97 1.88998H6.97C7.96523 1.88011 8.81158 2.58897 8.97 3.56998C9.14 4.48998 9.44 5.37998 9.87 6.20998C10.12 6.74998 9.97 7.37998 9.52 7.77998L8.27 9.02998C9.73449 11.5656 11.7644 13.5956 14.3 15.06L15.55 13.81C15.95 13.36 16.58 13.21 17.12 13.46C17.95 13.89 18.84 14.19 19.76 14.36C20.754 14.52 21.469 15.3826 21.45 16.38L22 16.92Z"
                                            stroke="#b45309" strokeWidth="1.5"
                                            strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Marcar como Contactado
                                </button>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}

/* Componente auxiliar para cada campo */
function Field({ label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#6E6E6E] uppercase tracking-wide">
                {label}
            </span>
            <span className="text-sm font-normal text-[#101010]">
                {value || "—"}
            </span>
        </div>
    );
}
