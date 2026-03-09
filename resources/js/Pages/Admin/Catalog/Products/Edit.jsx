import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useMemo } from "react";
import ProductForm from "./Form";

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
            <Head title={`Editar - ${product?.name?.es || "Producto"}`} />

            <div className="space-y-10">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Editar Producto
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Modificando:{" "}
                            <span className="font-medium text-gray-700">
                                {product?.name?.es}
                            </span>
                        </p>

                        {product?.image_url && (
                            <p className="text-xs text-gray-400 mt-1">
                                Imagen actual cargada: {product.image_url}
                            </p>
                        )}
                    </div>

                    <Link
                        href={route("admin.products.index")}
                        className="text-sm text-gray-600 hover:text-indigo-600 transition"
                    >
                        ← Volver al listado
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                    <ProductForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        processing={processing}
                        errors={errors}
                        buttonText={
                            processing
                                ? "Actualizando..."
                                : "Actualizar Producto"
                        }
                        categories={categories}
                    />

                </div>

            </div>
        </AdminLayout>
    );
}