import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import Form from "./Form";

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

            <Head title="Crear Certificado" />

            <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">
                {/* =======================================================
                   HEADER PROFESIONAL
                ======================================================= */}

                <div className="flex justify-between items-start border-b pb-6">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Crear Certificado
                        </h1>

                        <p className="text-sm text-gray-500 mt-2 max-w-xl">
                            Añade un nuevo certificado oficial al sistema.
                            Este documento será visible en la sección pública de Calidad.
                        </p>
                    </div>

                    <Link
                        href={route("admin.certificates.index")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        ← Volver
                    </Link>

                </div>

                {/* =======================================================
                   CARD PRINCIPAL
                ======================================================= */}

                <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-200 p-12">
                    <Form
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        buttonText="Crear Certificado"
                    />

                </div>

            </div>

        </AdminLayout>
    );
}