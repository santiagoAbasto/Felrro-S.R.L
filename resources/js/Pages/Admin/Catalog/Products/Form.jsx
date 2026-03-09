import { useEffect, useState } from "react";

/* ======================================================
   FORM PRINCIPAL
====================================================== */

export default function ProductForm({
    data,
    setData,
    submit,
    processing,
    errors,
    categories,
    buttonText
}) {

    /* ================= PREVIEWS CONTROLADOS ================= */

    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState([]);

    useEffect(() => {
        if (!data.image) {
            setImagePreview(null);
            return;
        }

        const url = URL.createObjectURL(data.image);
        setImagePreview(url);

        return () => URL.revokeObjectURL(url);
    }, [data.image]);

    useEffect(() => {
        if (!data.gallery?.length) {
            setGalleryPreview([]);
            return;
        }

        const urls = data.gallery.map(file => URL.createObjectURL(file));
        setGalleryPreview(urls);

        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [data.gallery]);

    return (
        <form
            onSubmit={submit}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-10"
        >

            {/* ================= CATEGORÍA ================= */}
            <Section title="Categoría">
                <select
                    value={data.category_id}
                    onChange={e => setData("category_id", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name?.es}
                        </option>
                    ))}
                </select>
                <Error text={errors.category_id} />
            </Section>

            {/* ================= INFORMACIÓN ================= */}
            <Section title="Información General">
                <LangInput
                    label="Nombre"
                    data={data.name}
                    setData={(v) => setData("name", v)}
                />

                <LangInput
                    label="Descripción Corta"
                    data={data.short_description}
                    setData={(v) => setData("short_description", v)}
                />

                <LangTextarea
                    label="Descripción Completa"
                    data={data.description}
                    setData={(v) => setData("description", v)}
                />
            </Section>

            {/* ================= IMAGEN PRINCIPAL ================= */}
            <Section title="Imagen Principal">

                {/* CARD INFORMATIVO */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-2">
                    <h3 className="font-semibold text-indigo-800">
                        Recomendaciones
                    </h3>
                    <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• Resolución recomendada: 1200px ancho mínimo</li>
                        <li>• Tamaño máximo recomendado: 3MB</li>
                        <li>• Formatos permitidos: JPG, PNG, WEBP</li>
                        <li>• Fondo limpio y producto centrado</li>
                    </ul>
                </div>

                {/* PREVIEW EXISTENTE */}
                {(imagePreview || data.existing_image) && (
                    <div className="relative group w-60">

                        <img
                            src={imagePreview || data.existing_image}
                            className="h-44 w-44 object-contain border-2 border-indigo-200 rounded-xl bg-gray-50 shadow-sm cursor-pointer transition hover:shadow-md"
                            alt="Preview"
                            onClick={() => document.getElementById("main-image-input").click()}
                        />

                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            Click para reemplazar
                        </div>

                    </div>
                )}

                {/* BOTONES MEJORADOS */}
                <div className="flex items-center gap-4 mt-4">

                    <label
                        htmlFor="main-image-input"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
                    >
                        {imagePreview || data.existing_image
                            ? "Reemplazar Imagen"
                            : "Subir Imagen"}
                    </label>

                    {(imagePreview || data.existing_image) && (
                        <button
                            type="button"
                            onClick={() => {
                                setData("image", null);
                                setImagePreview(null);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                        >
                            Quitar
                        </button>
                    )}

                </div>

                {/* INPUT OCULTO */}
                <input
                    id="main-image-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (file.size > 3 * 1024 * 1024) {
                            alert("La imagen supera los 3MB permitidos");
                            return;
                        }

                        setData("image", file);
                    }}
                    className="hidden"
                />

                <Error text={errors.image} />

            </Section>

            {/* ================= GALERÍA ================= */}
            <Section title="Imágenes Adicionales">

                {/* ================= EXISTENTES ================= */}
                {data.existing_gallery?.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            Imágenes actuales
                        </p>

                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                            {data.existing_gallery.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="relative group border rounded-lg overflow-hidden bg-gray-50"
                                >

                                    <img
                                        src={img.image_url || `/storage/${img.image}`}
                                        className="h-28 w-full object-contain cursor-pointer"
                                        alt="Galería"
                                        onClick={() =>
                                            document
                                                .getElementById(`replace-gallery-${img.id}`)
                                                .click()
                                        }
                                    />

                                    {/* REEMPLAZO */}
                                    <input
                                        id={`replace-gallery-${img.id}`}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            if (file.size > 3 * 1024 * 1024) {
                                                alert("Máximo 3MB permitido");
                                                return;
                                            }

                                            setData("gallery", [...data.gallery, file]);

                                            // eliminar visualmente la anterior
                                            setData(
                                                "existing_gallery",
                                                data.existing_gallery.filter(
                                                    (g) => g.id !== img.id
                                                )
                                            );
                                        }}
                                    />

                                    {/* ELIMINAR */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData(
                                                "existing_gallery",
                                                data.existing_gallery.filter(
                                                    (g) => g.id !== img.id
                                                )
                                            );
                                        }}
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>

                                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                                        Click para reemplazar
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================= NUEVAS ================= */}
                {galleryPreview.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs text-amber-600 font-medium mb-2">
                            Nuevas imágenes seleccionadas
                        </p>

                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                            {galleryPreview.map((url, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={url}
                                        className="h-28 w-full object-contain border-2 border-amber-400 rounded-lg bg-gray-50"
                                        alt="Preview galería"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================= BOTÓN SUBIR ================= */}
                <div className="space-y-3">

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-700">
                        • Tamaño máximo por imagen: 3MB
                        • Formatos permitidos: JPG, PNG, WEBP
                        • Se recomienda 1000px ancho mínimo
                    </div>

                    <label className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer">
                        Agregar nuevas imágenes
                        <input
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);

                                const validFiles = files.filter(file => {
                                    if (file.size > 3 * 1024 * 1024) {
                                        alert(`${file.name} supera los 3MB`);
                                        return false;
                                    }
                                    return true;
                                });

                                setData("gallery", [...data.gallery, ...validFiles]);
                            }}
                            className="hidden"
                        />
                    </label>

                </div>

                <Error text={errors.gallery} />

            </Section>

            {/* ================= FICHA TÉCNICA ================= */}
            <Section title="Ficha Técnica (PDF)">
                <FileInput
                    label="Subir ficha técnica"
                    accept="application/pdf"
                    onChange={(file) => setData("ficha_tecnica_file", file)}
                />
            </Section>

            {/* ================= BLOQUES DINÁMICOS ================= */}
            <BlockRepeater
                title="Construcción"
                items={data.constructions}
                onChange={(items) => setData("constructions", items)}
            />

            <BlockRepeater
                title="Aplicaciones"
                items={data.applications}
                onChange={(items) => setData("applications", items)}
            />

            <BlockRepeater
                title="Información Adicional"
                items={data.extras}
                onChange={(items) => setData("extras", items)}
            />

            <BlockRepeater
                title="Especificaciones Técnicas"
                items={data.specifications}
                onChange={(items) => setData("specifications", items)}
            />

            {/* ================= CONFIGURACIÓN ================= */}
            <Section title="Configuración">

                <div className="flex flex-col md:flex-row md:justify-between gap-6">

                    <Toggle
                        label="Producto Activo"
                        value={data.is_active}
                        onChange={() => setData("is_active", !data.is_active)}
                    />

                    <Toggle
                        label="Producto Destacado"
                        value={data.featured}
                        onChange={() => {
                            const newValue = !data.featured;
                            setData("featured", newValue);

                            if (!newValue) {
                                setData("featured_order", "");
                            }
                        }}
                    />
                </div>

                {data.featured && (
                    <div className="space-y-2 mt-6">
                        <label className="text-sm font-medium text-gray-700">
                            Orden Empresarial (A, AA, AB...)
                        </label>

                        <input
                            type="text"
                            value={data.featured_order || ""}
                            onChange={(e) =>
                                setData(
                                    "featured_order",
                                    e.target.value
                                        .toUpperCase()
                                        .replace(/[^A-Z]/g, "")
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />

                        <Error text={errors.featured_order} />
                    </div>
                )}
            </Section>

            {/* ================= BOTÓN ================= */}
            <div className="pt-6 border-t">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition font-semibold shadow-sm disabled:opacity-50"
                >
                    {processing ? "Guardando..." : buttonText}
                </button>
            </div>

        </form>
    );
}

/* ======================================================
   COMPONENTES AUXILIARES
====================================================== */

function Section({ title, children }) {
    return (
        <div className="space-y-5 border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            {children}
        </div>
    );
}

function FileInput({ label, onChange, multiple = false, accept }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={(e) =>
                    multiple
                        ? onChange(e.target.files)
                        : onChange(e.target.files[0])
                }
                className="block w-full text-sm text-gray-600
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100"
            />
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
            <span className="text-sm text-gray-700">{label}</span>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${value ? "bg-indigo-600" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${value ? "translate-x-5" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

function Error({ text }) {
    if (!text) return null;
    return <p className="text-red-500 text-sm mt-1">{text}</p>;
}

function LangInput({ label, data = { es: "", en: "" }, setData }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="text-sm font-medium text-gray-700">
                    {label} (ES)
                </label>
                <input
                    value={data?.es || ""}
                    onChange={e => setData({ ...data, es: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">
                    {label} (EN)
                </label>
                <input
                    value={data?.en || ""}
                    onChange={e => setData({ ...data, en: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
        </div>
    );
}

function LangTextarea({ label, data = { es: "", en: "" }, setData }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <textarea
                placeholder={`${label} (ES)`}
                value={data?.es || ""}
                onChange={e => setData({ ...data, es: e.target.value })}
                className="border rounded p-2 h-28"
            />
            <textarea
                placeholder={`${label} (EN)`}
                value={data?.en || ""}
                onChange={e => setData({ ...data, en: e.target.value })}
                className="border rounded p-2 h-28"
            />
        </div>
    );
}

function BlockRepeater({ title, items = [], onChange }) {

    const addItem = () => {
        onChange([
            ...items,
            { title: { es: "", en: "" }, content: { es: "", en: "" } }
        ]);
    };

    const updateItem = (index, field, lang, value) => {
        const updated = [...items];
        updated[index][field][lang] = value;
        onChange(updated);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-5 border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-4">

                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            placeholder="Título (ES)"
                            value={item.title?.es || ""}
                            onChange={e => updateItem(index, "title", "es", e.target.value)}
                            className="border rounded p-2"
                        />
                        <input
                            placeholder="Título (EN)"
                            value={item.title?.en || ""}
                            onChange={e => updateItem(index, "title", "en", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <textarea
                            placeholder="Contenido (ES)"
                            value={item.content?.es || ""}
                            onChange={e => updateItem(index, "content", "es", e.target.value)}
                            className="border rounded p-2"
                        />
                        <textarea
                            placeholder="Contenido (EN)"
                            value={item.content?.en || ""}
                            onChange={e => updateItem(index, "content", "en", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 text-xs"
                    >
                        Eliminar
                    </button>

                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
            >
                + Agregar {title}
            </button>
        </div>
    );
}