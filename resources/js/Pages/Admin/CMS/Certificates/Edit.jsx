import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import Form from "./Form";

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

    return (
        <AdminLayout>
            <Head title="Editar Certificado" />

            <div className="p-10">
                <h1 className="text-2xl font-bold mb-6">Editar Certificado</h1>

                <Form
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                    existingFile={certificate.file}
                    existingLogo={certificate.image_logo ? `/storage/${certificate.image_logo}` : null}
                    buttonText="Actualizar"
                />
            </div>
        </AdminLayout>
    );
}