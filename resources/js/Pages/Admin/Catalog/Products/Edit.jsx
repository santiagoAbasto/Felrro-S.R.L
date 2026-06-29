import AdminLayout from "@/Layouts/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/FormElements";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import ProductForm from "./Form";

const normalizeBlocks = (items = []) =>
    items.map((item) => ({
        title: item.title || { es: "", en: "" },
        content: item.content || { es: "", en: "" },
    }));

export default function Edit({ product, categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        category_id: product.category_id || "",
        name: product.name || { es: "", en: "" },
        short_description: product.short_description || { es: "", en: "" },
        description: product.description || { es: "", en: "" },
        image: null,
        existing_image: product.image ? product.image_url : null,
        remove_image: false,
        gallery: [],
        existing_gallery: product.images || [],
        deleted_gallery_images: [],
        ficha_tecnica_file: null,
        existing_ficha: product.ficha_tecnica_url || null,
        pdf_color_table: null,
        existing_pdf_color_table: product.pdf_color_table_url || null,
        remove_pdf_color_table: false,
        featured: Boolean(product.featured),
        featured_order: product.featured_order || "",
        is_active: Boolean(product.is_active),
        constructions: normalizeBlocks(product.constructions),
        applications: normalizeBlocks(product.applications),
        extras: normalizeBlocks(product.extras),
        specifications: normalizeBlocks(product.specifications),
        technical_sections: product.technical_sections || [],
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.products.update", product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Editar ${product.name?.es || "producto"}`} />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Editar producto"
                    description="Actualizá datos comerciales, imágenes, ficha técnica y bloques de información del producto."
                />

                <ProductForm
                    data={data}
                    setData={setData}
                    submit={submit}
                    processing={processing}
                    errors={errors}
                    categories={categories}
                    buttonText="Guardar cambios"
                />
            </div>
        </AdminLayout>
    );
}
