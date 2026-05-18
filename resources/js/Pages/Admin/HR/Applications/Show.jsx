import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Toast from "@/Components/Toast";
import {
    AdminPageHeader,
    AdminSectionCard,
} from "@/Components/Admin/FormElements";

export default function Show({ application }) {
    const { flash } = usePage().props;

    const destroyApplication = () => {
        if (confirm(`¿Querés eliminar la postulación de ${application.full_name}? También se eliminarán sus archivos adjuntos.`)) {
            router.delete(route("admin.hr.applications.destroy", application.id), {
                onSuccess: () => router.visit(route("admin.hr.applications.index")),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Detalle de postulación" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title={application.full_name}
                    description="Detalle de la postulación, datos personales, archivos adjuntos y acciones de seguimiento."
                    actions={
                        <>
                            <Link
                                href={route("admin.hr.applications.index")}
                                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Volver al listado
                            </Link>
                            <button
                                type="button"
                                onClick={destroyApplication}
                                className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                            >
                                Eliminar
                            </button>
                        </>
                    }
                />

                <AdminSectionCard
                    title="Estado"
                    description="Marcá internamente si la postulación ya fue revisada o si el candidato fue contactado."
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge active={application.is_reviewed} activeText="Revisado" inactiveText="Pendiente" />
                        {application.is_contacted ? (
                            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                Contactado
                            </span>
                        ) : null}

                        {!application.is_reviewed ? (
                            <button
                                type="button"
                                onClick={() => router.post(route("admin.hr.applications.markReviewed", application.id))}
                                className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                            >
                                Marcar como revisado
                            </button>
                        ) : null}

                        {!application.is_contacted ? (
                            <button
                                type="button"
                                onClick={() => router.post(route("admin.hr.applications.markContacted", application.id))}
                                className="text-sm font-semibold text-amber-600 transition hover:text-amber-700"
                            >
                                Marcar como contactado
                            </button>
                        ) : null}
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Datos personales"
                    description="Información enviada por el postulante desde el formulario público."
                >
                    <div className="grid gap-5 md:grid-cols-2">
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
                </AdminSectionCard>

                <AdminSectionCard
                    title="Archivos adjuntos"
                    description="Descargá la documentación presentada por el candidato."
                >
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={route("admin.hr.applications.downloadCv", application.id)}
                            className="rounded-2xl bg-[#25A7CA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Descargar CV
                        </a>
                        {application.cover_letter_url ? (
                            <a
                                href={route("admin.hr.applications.downloadCoverLetter", application.id)}
                                className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Descargar carta
                            </a>
                        ) : null}
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ active, activeText, inactiveText }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
        >
            {active ? activeText : inactiveText}
        </span>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{value || "—"}</p>
        </div>
    );
}
