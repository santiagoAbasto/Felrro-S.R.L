import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import Form from "./Form";
import { AdminPageHeader } from "@/Components/Admin/FormElements";

export default function Edit({ certificate }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        name: certificate.name ?? { es: "", en: "" },
        order: certificate.order ?? "",
        file: null,
        image_logo: null,
        format: certificate.format ?? "",
        weight: certificate.weight ?? "",
        is_active: certificate.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.certificates.update", certificate.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar certificado" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Editar certificado"
                    description="Actualizá el documento, los textos y el estado de publicación."
                    actions={
                        <Link
                            href={route("admin.certificates.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Volver al listado
                        </Link>
                    }
                />

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <Form
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        buttonText="Guardar certificado"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
