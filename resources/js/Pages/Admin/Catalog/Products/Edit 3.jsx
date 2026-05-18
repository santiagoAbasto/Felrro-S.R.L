import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useMemo } from "react";
import { route } from "ziggy-js";
import ProductForm from "./Form";
import { AdminPageHeader } from "@/Components/Admin/FormElements";

export default function Edit({ product, categories }) {

    const normalizedProduct = useMemo(() => ({
        category_id: product?.category_id ?? "",

        name: product?.name ?? { es: "", en: "" },
        short_description: product?.short_description ?? { es: "", en: "" },
        description: product?.description ?? { es: "", en: "" },

        featured: Boolean(product?.featured),
        featured_order: product?.featured_order ?? "",
        is_active: Boolean(product?.is_active),

        constructions: product?.constructions ?? [],
        applications: product?.applications ?? [],
        extras: product?.extras ?? [],
        specifications: product?.specifications ?? [],
        technical_sections: product?.technical_sections ?? [],
    }), [product]);

    const { data, setData, post, processing, errors } = useForm({

        /* RELACIÓN */
        category_id: normalizedProduct.category_id,

        /* MULTILENGUAJE */
        name: normalizedProduct.name,
        short_description: normalizedProduct.short_description,
        description: normalizedProduct.description,

        /* IMÁGENES */
        image: null,
        gallery: [],

        // 👇 IMPORTANTE: usamos image_url directamente
        existing_image: product?.image_url ?? null,
        existing_gallery: product?.images ?? [],

        delete_main_image: false,
        delete_gallery_images: [],

        /* FICHA */
        ficha_tecnica_file: null,

        // 👇 IMPORTANTE: usamos ficha_tecnica_url directamente
        existing_ficha: product?.ficha_tecnica_url ?? null,
        delete_ficha: false,

        /* FLAGS */
        featured: normalizedProduct.featured,
        featured_order: normalizedProduct.featured_order,
        is_active: normalizedProduct.is_active,

        /* BLOQUES */
        constructions: normalizedProduct.constructions,
        applications: normalizedProduct.applications,
        extras: normalizedProduct.extras,
        specifications: normalizedProduct.specifications,
        technical_sections: normalizedProduct.technical_sections,

        _method: "put",
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;

        post(route("admin.products.update", product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Editar ${product?.name?.es || "producto"}`} />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title={`Editar ${product?.name?.es || "producto"}`}
                    description="Podés ajustar el contenido, revisar imágenes y actualizar la ficha técnica sin perder lo ya cargado."
                    actions={
                        <Link
                            href={route("admin.products.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Volver al listado
                        </Link>
                    }
                />

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <ProductForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        processing={processing}
                        errors={errors}
                        buttonText={
                            processing
                                ? "Guardando..."
                                : "Guardar cambios"
                        }
                        categories={categories}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
