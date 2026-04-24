import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import ProductForm from "./Form";
import { AdminPageHeader } from "@/Components/Admin/FormElements";

export default function Create({ categories }) {

    const { data, setData, post, processing, errors, reset } = useForm({

        /* ================= RELACIÓN ================= */
        category_id: "",

        /* ================= MULTILENGUAJE ================= */
        name: { es: "", en: "" },
        short_description: { es: "", en: "" },
        description: { es: "", en: "" },

        /* ================= IMAGEN PRINCIPAL ================= */
        image: null,

        /* ================= GALERÍA ================= */
        gallery: [],

        /* ================= FICHA TÉCNICA ================= */
        ficha_tecnica_file: null,

        /* ================= FLAGS ================= */
        featured: false,
        featured_order: "",
        is_active: true,

        /* ================= BLOQUES DINÁMICOS ================= */
        constructions: [],
        applications: [],
        extras: [],
        specifications: [],
    });

    /* =====================================================
       SUBMIT CONTROLADO (ANTI-LOOP ENTERPRISE)
    ===================================================== */
    const submit = (e) => {
        e.preventDefault();
        if (processing) return;

        post(route("admin.products.store"), {
            forceFormData: true,
            preserveScroll: true,
            onError: () => {},
        });
    };

    return (
        <AdminLayout>
            <Head title="Nuevo producto" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Nuevo producto"
                    description="Completá la información del producto, revisá las imágenes antes de guardar y dejá la ficha lista para el catálogo."
                />

                <ProductForm
                    data={data}
                    setData={setData}
                    submit={submit}
                    processing={processing}
                    errors={errors}
                    categories={categories}
                    buttonText="Guardar producto"
                />

            </div>
        </AdminLayout>
    );
}
