import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CategoryForm from "./Form";

export default function Edit({ category }) {

    const { data, setData, post, processing, errors } = useForm({
        name: category.name ?? { es: "", en: "" },
        description: category.description ?? { es: "", en: "" },
        order: category.order ?? "",
        is_active: category.is_active ?? true,
        is_featured: category.is_featured ?? false,
        featured_order: category.featured_order ?? "",

        image: null,
        delete_image: false,

        _method: "put",
    });

    const [preview, setPreview] = useState(null);

    /* =====================================================
       PREVIEW INICIAL DESDE BD
    ===================================================== */
    useEffect(() => {
        if (category.image_url) {
            setPreview(category.image_url);
        }
    }, [category.image_url]);

    /* =====================================================
       PREVIEW CUANDO SUBE NUEVA IMAGEN
    ===================================================== */
    useEffect(() => {
        if (data.image instanceof File) {
            const objectUrl = URL.createObjectURL(data.image);
            setPreview(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [data.image]);

    /* =====================================================
       ELIMINAR IMAGEN
    ===================================================== */
    const handleDeleteImage = () => {
        setData("delete_image", true);
        setData("image", null);
        setPreview(null);
    };

    /* =====================================================
       SUBMIT
    ===================================================== */
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.product-categories.update", category.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Editar Categoría - ${category.name?.es ?? ""}`} />

            <div className="space-y-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Editar Categoría
                </h1>

                <CategoryForm
                    data={data}
                    setData={setData}
                    submit={submit}
                    processing={processing}
                    errors={errors}
                    buttonText="Actualizar Categoría"
                    preview={preview}
                    onDeleteImage={handleDeleteImage}
                />

            </div>
        </AdminLayout>
    );
}