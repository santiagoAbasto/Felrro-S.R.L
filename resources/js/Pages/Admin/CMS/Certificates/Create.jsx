import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
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

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.certificates.store"), {
            forceFormData: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Nuevo certificado" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Nuevo certificado"
                    description="Cargá el documento y, si querés, su logo. Todo queda preparado para mostrarse dentro de la sección Calidad."
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
