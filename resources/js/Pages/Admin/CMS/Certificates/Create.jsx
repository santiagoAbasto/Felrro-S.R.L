import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import Form from "./Form";
import { AdminPageHeader } from "@/Components/Admin/FormElements";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        order: "",
        file: null,
        image_logo: null,
        format: "",
        weight: "",
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.certificates.store"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Crear certificado" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Nuevo certificado"
                    description="Cargá el documento, su logo y el orden de publicación para que quede disponible en la web."
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
                        buttonText="Crear certificado"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
