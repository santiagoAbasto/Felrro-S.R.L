import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import Form from "./Form";
import { AdminPageHeader } from "@/Components/Admin/FormElements";

export default function Edit({ certificate }) {

    const { data, setData, put, processing, errors } = useForm({
        name: certificate.name,
        order: certificate.order,
        file: null,
        image_logo: null,
        format: certificate.format || "",
        weight: certificate.weight || "",
        is_active: certificate.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.certificates.update", certificate.id), {
            forceFormData: true
        });
    };

    const destroyCertificate = () => {
        if (!confirm(`¿Eliminar el certificado "${certificate.name?.es ?? "sin nombre"}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        router.delete(route("admin.certificates.destroy", certificate.id), {
            onSuccess: () => router.visit(route("admin.certificates.index")),
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar certificado" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Editar certificado"
                    description="Podés actualizar nombre, logo y archivo sin perder la vista previa. Si eliminás este certificado, volvés automáticamente al listado."
                    actions={[
                        <Link
                            key="back"
                            href={route("admin.certificates.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Volver al listado
                        </Link>,
                        <button
                            key="delete"
                            type="button"
                            onClick={destroyCertificate}
                            className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            Eliminar
                        </button>,
                    ]}
                />

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <Form
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        existingFile={certificate.file}
                        existingLogo={certificate.image_logo ? `/storage/${certificate.image_logo}` : null}
                        buttonText="Guardar cambios"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
