import {
    AdminFileField,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import { useEffect, useState } from "react";

const IMAGE_MAX_MB = 3;
const IMAGE_HINT = "Formato admitido: JPG, PNG o WEBP. Recomendación para miniatura: 288 x 288 px.";

export default function ProductForm({
    data,
    setData,
    submit,
    processing,
    errors,
    categories,
    buttonText,
}) {
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState([]);
    const [galleryError, setGalleryError] = useState("");

    useEffect(() => {
        if (!(data.image instanceof File)) {
            setMainImagePreview(null);
            return undefined;
        }

        const url = URL.createObjectURL(data.image);
        setMainImagePreview(url);

        return () => URL.revokeObjectURL(url);
    }, [data.image]);

    useEffect(() => {
        if (!data.gallery?.length) {
            setGalleryPreview([]);
            return undefined;
        }

        const urls = data.gallery.map((file) => URL.createObjectURL(file));
        setGalleryPreview(urls);

        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [data.gallery]);

    const handleGalleryChange = (files) => {
        const selectedFiles = Array.from(files ?? []);
        const validFiles = [];
        const invalidMessages = [];

        selectedFiles.forEach((file) => {
            if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
                invalidMessages.push(`${file.name}: supera los ${IMAGE_MAX_MB} MB.`);
                return;
            }

            validFiles.push(file);
        });

        setGalleryError(invalidMessages.join(" "));
        setData("gallery", validFiles);
    };

    return (
        <form onSubmit={submit} className="space-y-8">
            <AdminSectionCard
                title="Categoría y datos principales"
                description="Primero elegí la categoría y después completá el nombre y las descripciones del producto."
            >
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Categoría
                    </label>
                    <select
                        value={data.category_id}
                        onChange={(event) => setData("category_id", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name?.es}
                            </option>
                        ))}
                    </select>
                    <Error text={errors.category_id} />
                </div>

                <LangInputGroup
                    label="Nombre del producto"
                    data={data.name}
                    setData={(value) => setData("name", value)}
                    errorEs={errors["name.es"]}
                    errorEn={errors["name.en"]}
                />

                <LangInputGroup
                    label="Descripción corta"
                    data={data.short_description}
                    setData={(value) => setData("short_description", value)}
                    errorEs={errors["short_description.es"]}
                    errorEn={errors["short_description.en"]}
                />

                <LangTextareaGroup
                    label="Descripción completa"
                    data={data.description}
                    setData={(value) => setData("description", value)}
                    errorEs={errors["description.es"]}
                    errorEn={errors["description.en"]}
                />
            </AdminSectionCard>

            <AdminSectionCard
                title="Imagen principal"
                description="La imagen principal se usa como miniatura del producto. Para este sitio conviene trabajar con una pieza cuadrada y limpia."
                tone="accent"
            >
                <div className="rounded-[24px] border border-[#25A7CA]/20 bg-[#25A7CA]/[0.04] p-5 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Recomendación de imagen</p>
                    <ul className="mt-3 space-y-2">
                        <li>Resolución recomendada: 288 x 288 px</li>
                        <li>Tamaño máximo por imagen: 3 MB</li>
                        <li>Formatos admitidos: JPG, PNG o WEBP</li>
                        <li>Conviene usar fondo limpio y producto centrado</li>
                    </ul>
                </div>

                <AdminFileField
                    label="Imagen principal"
                    value={data.image}
                    onChange={(file) => setData("image", file)}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={IMAGE_MAX_MB}
                    previewUrl={mainImagePreview}
                    currentUrl={data.existing_image ?? null}
                    currentLabel={data.existing_image ? "Imagen actual del producto" : null}
                    hint={IMAGE_HINT}
                    error={errors.image}
                    buttonLabel={data.existing_image ? "Reemplazar imagen" : "Seleccionar imagen"}
                />
            </AdminSectionCard>

            <AdminSectionCard
                title="Galería del producto"
                description="Si querés actualizar la galería, subí nuevamente el conjunto completo de imágenes. La vista previa te muestra lo que se guardará."
            >
                {data.existing_gallery?.length > 0 && data.gallery.length === 0 ? (
                    <div>
                        <p className="mb-3 text-sm font-semibold text-slate-700">Galería actual</p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {data.existing_gallery.map((image) => (
                                <div
                                    key={image.id}
                                    className="overflow-hidden rounded-[22px] border border-slate-200 bg-white"
                                >
                                    <img
                                        src={image.image_url || `/storage/${image.image}`}
                                        alt="Imagen de galería"
                                        className="h-36 w-full object-contain bg-slate-50"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]">
                            Seleccionar imágenes
                            <input
                                type="file"
                                multiple
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(event) => handleGalleryChange(event.target.files)}
                                className="hidden"
                            />
                        </label>
                        <span className="text-xs text-slate-400">
                            Recomendación: 288 x 288 px por imagen.
                        </span>
                    </div>

                    {galleryError ? <p className="mt-3 text-xs font-medium text-red-500">{galleryError}</p> : null}
                    <Error text={errors.gallery} />

                    {galleryPreview.length > 0 ? (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {galleryPreview.map((url, index) => (
                                <div
                                    key={url}
                                    className="overflow-hidden rounded-[22px] border border-slate-200 bg-white"
                                >
                                    <img
                                        src={url}
                                        alt={`Vista previa ${index + 1}`}
                                        className="h-36 w-full object-contain bg-slate-50"
                                    />
                                    <div className="px-3 py-2 text-xs text-slate-500">
                                        {data.gallery[index]?.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Ficha técnica"
                description="Podés cargar un PDF para que el visitante descargue la ficha del producto."
            >
                <AdminFileField
                    label="Archivo PDF"
                    value={data.ficha_tecnica_file}
                    onChange={(file) => setData("ficha_tecnica_file", file)}
                    accept="application/pdf"
                    maxSizeMB={5}
                    currentUrl={data.existing_ficha ?? null}
                    currentLabel={data.existing_ficha ? "Ficha técnica actual cargada" : null}
                    hint="Solo se admite PDF. El tamaño máximo es 5 MB."
                    error={errors.ficha_tecnica_file}
                    kind="document"
                    optional
                    buttonLabel="Seleccionar PDF"
                />
            </AdminSectionCard>

            <BlockRepeater
                title="Construcción"
                description="Usá estos bloques para describir materiales, armado o estructura del producto."
                items={data.constructions}
                onChange={(items) => setData("constructions", items)}
            />

            <BlockRepeater
                title="Aplicaciones"
                description="Contá para qué usos o industrias está pensado este producto."
                items={data.applications}
                onChange={(items) => setData("applications", items)}
            />

            <BlockRepeater
                title="Información adicional"
                description="Acá podés sumar detalles complementarios que ayuden en la decisión."
                items={data.extras}
                onChange={(items) => setData("extras", items)}
            />

            <BlockRepeater
                title="Especificaciones técnicas"
                description="Usá un bloque por característica para que la información quede más ordenada."
                items={data.specifications}
                onChange={(items) => setData("specifications", items)}
            />

            <AdminSectionCard
                title="Visibilidad del producto"
                description="Definí si el producto se muestra en el catálogo y si además querés destacarlo en la web."
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    <AdminToggle
                        label="Mostrar producto en el catálogo"
                        hint="Si lo desactivás, el producto queda guardado pero no se publica."
                        checked={data.is_active}
                        onChange={(value) => setData("is_active", value)}
                    />
                    <AdminToggle
                        label="Marcar como producto destacado"
                        hint="Solo activalo si querés que tenga un lugar especial en la web."
                        checked={data.featured}
                        onChange={(value) => {
                            setData("featured", value);
                            if (!value) {
                                setData("featured_order", "");
                            }
                        }}
                    />
                </div>

                {data.featured ? (
                    <AdminTextInput
                        label="Orden del destacado"
                        value={data.featured_order || ""}
                        onChange={(value) =>
                            setData(
                                "featured_order",
                                value.toUpperCase().replace(/[^A-Z]/g, "")
                            )
                        }
                        placeholder="Ej: A, AA o AB"
                        hint="Usá una referencia corta para ordenar los productos destacados."
                        error={errors.featured_order}
                    />
                ) : null}
            </AdminSectionCard>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                >
                    {processing ? "Guardando..." : buttonText}
                </button>
            </div>
        </form>
    );
}

function Error({ text }) {
    if (!text) return null;
    return <p className="mt-2 text-xs font-medium text-red-500">{text}</p>;
}

function LangInputGroup({ label, data = { es: "", en: "" }, setData, errorEs, errorEn }) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <AdminTextInput
                label={`${label}`}
                value={data?.es || ""}
                onChange={(value) => setData({ ...data, es: value })}
                placeholder="Versión en español"
                error={errorEs}
            />
            <AdminTextInput
                label={`${label} en inglés`}
                value={data?.en || ""}
                onChange={(value) => setData({ ...data, en: value })}
                placeholder="Versión en inglés"
                error={errorEn}
                optional
            />
        </div>
    );
}

function LangTextareaGroup({ label, data = { es: "", en: "" }, setData, errorEs, errorEn }) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <AdminRichTextarea
                label={label}
                value={data?.es || ""}
                onChange={(value) => setData({ ...data, es: value })}
                placeholder="Versión en español"
                error={errorEs}
            />
            <AdminRichTextarea
                label={`${label} en inglés`}
                value={data?.en || ""}
                onChange={(value) => setData({ ...data, en: value })}
                placeholder="Versión en inglés"
                error={errorEn}
                optional
            />
        </div>
    );
}

function BlockRepeater({ title, description, items = [], onChange }) {
    const addItem = () => {
        onChange([
            ...items,
            { title: { es: "", en: "" }, content: { es: "", en: "" } },
        ]);
    };

    const updateItem = (index, field, lang, value) => {
        const updated = [...items];
        updated[index][field][lang] = value;
        onChange(updated);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <AdminSectionCard title={title} description={description}>
            <div className="space-y-5">
                {items.map((item, index) => (
                    <div key={index} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label={`Título ${index + 1}`}
                                value={item.title?.es || ""}
                                onChange={(value) => updateItem(index, "title", "es", value)}
                                placeholder="Versión en español"
                            />
                            <AdminTextInput
                                label={`Título ${index + 1} en inglés`}
                                value={item.title?.en || ""}
                                onChange={(value) => updateItem(index, "title", "en", value)}
                                placeholder="Versión en inglés"
                                optional
                            />
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label={`Contenido ${index + 1}`}
                                value={item.content?.es || ""}
                                onChange={(value) => updateItem(index, "content", "es", value)}
                                placeholder="Versión en español"
                            />
                            <AdminRichTextarea
                                label={`Contenido ${index + 1} en inglés`}
                                value={item.content?.en || ""}
                                onChange={(value) => updateItem(index, "content", "en", value)}
                                placeholder="Versión en inglés"
                                optional
                            />
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                            >
                                Eliminar bloque
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
                Agregar bloque
            </button>
        </AdminSectionCard>
    );
}
