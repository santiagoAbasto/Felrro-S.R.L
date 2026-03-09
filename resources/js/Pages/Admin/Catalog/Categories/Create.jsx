import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CategoryForm from "./Form";

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        description: { es: "", en: "" },
        order: "",
        is_active: true,
        is_featured: false,
        featured_order: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);

    /* ===============================
       PREVIEW IMAGEN
    =============================== */
    useEffect(() => {
        if (data.image instanceof File) {
            const url = URL.createObjectURL(data.image);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.image]);

    /* ===============================
       SUBMIT
    =============================== */
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.product-categories.store"), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Crear Categoría" />

            <div className="space-y-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Crear Nueva Categoría
                </h1>

                <CategoryForm
                    data={data}
                    setData={setData}
                    submit={submit}
                    processing={processing}
                    errors={errors}
                    buttonText="Crear Categoría"
                    preview={preview}
                />

            </div>
        </AdminLayout>
    );
}