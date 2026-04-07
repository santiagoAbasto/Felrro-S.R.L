import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
            <Head title="Editar Certificado" />

            <div className="p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Editar Certificado</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Actualiza el logo, el archivo PDF y los datos visibles en la sección pública de Calidad.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route("admin.certificates.index")}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        >
                            Volver
                        </Link>

                        <button
                            type="button"
                            onClick={destroyCertificate}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>

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
