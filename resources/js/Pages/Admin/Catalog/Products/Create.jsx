import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useCallback } from "react";
import ProductForm from "./Form";



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
    const submit = useCallback((e) => {
        e.preventDefault();

        if (processing) return; // 🚫 evita doble envío

        post(route("admin.products.store"), {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.log("ERRORES BACKEND:", errors);
            }
        });

    }, [processing]);

    console.log(data);

    return (
        <AdminLayout>
            <Head title="Crear Producto" />

            <div className="space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Crear Nuevo Producto
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Complete la información del producto para agregarlo al catálogo.
                    </p>
                </div>

                <ProductForm
                    data={data}
                    setData={setData}
                    submit={submit}
                    processing={processing}
                    errors={errors}
                    categories={categories}
                    buttonText="Crear Producto"
                />

            </div>
        </AdminLayout>
    );
}