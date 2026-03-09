import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState, useRef } from "react";

const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Edit({ section }) {

    const [deletedImages, setDeletedImages] = useState([]);
    const [localImages, setLocalImages] = useState(section.images ?? []);
    const fileInputRefs = useRef({});

    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        // Campos globales del hero (fallback si el slide no tiene contenido propio)
        title: section.title ?? { es: "", en: "" },
        subtitle: section.subtitle ?? { es: "", en: "" },
        content: section.content ?? { es: "", en: "" },
        button_text: section.button_text ?? { es: "", en: "" },
        button_link: section.button_link ?? "",
        is_active: section.is_active ?? true,
        // Nuevas imágenes a subir
        images: [],
        deleted_images: [],
        // Contenido por slide (id + campos editables)
        slide_data: (section.images ?? []).map(img => ({
            id: img.id,
            title: img.title ?? { es: "", en: "" },
            subtitle: img.subtitle ?? { es: "", en: "" },
            button_text: img.button_text ?? { es: "", en: "" },
            button_link: img.button_link ?? "",
            media_type: img.media_type ?? "image",
            video_url: img.video_url ?? "",
        })),
    });

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Formato no permitido (JPG, PNG, WEBP)";
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return `La imagen supera el tamaño máximo de ${MAX_SIZE_MB}MB`;
        }
        return null;
    };

    const handleDeleteImage = (id) => {
        setLocalImages(prev => prev.filter(img => img.id !== id));
        const updated = [...deletedImages, id];
        setDeletedImages(updated);
        setData("deleted_images", updated);
        setData("slide_data", data.slide_data.filter(s => s.id !== id));
    };

    const handleReplaceImage = (id, file) => {
        if (!file) return;
        const error = validateFile(file);
        if (error) { alert(error); return; }

        const previewUrl = URL.createObjectURL(file);
        setLocalImages(prev =>
            prev.map(img =>
                img.id === id ? { ...img, image: previewUrl, isPreview: true } : img
            )
        );

        const updatedDeleted = [...deletedImages, id];
        setDeletedImages(updatedDeleted);
        setData("deleted_images", updatedDeleted);
        setData("images", [...data.images, file]);
    };

    const handleNewImages = (files) => {
        const fileArray = Array.from(files);
        const validFiles = [];

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (!error) {
                validFiles.push(file);
                const previewUrl = URL.createObjectURL(file);
                setLocalImages(prev => [
                    ...prev,
                    { id: `new-${Date.now()}-${Math.random()}`, image: previewUrl, isPreview: true, isNew: true }
                ]);
            } else {
                alert(error);
            }
        });

        setData("images", [...data.images, ...validFiles]);
    };

    const updateSlideData = (id, field, value) => {
        setData("slide_data", data.slide_data.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const updateSlideNestedData = (id, field, subfield, value) => {
        setData("slide_data", data.slide_data.map(s =>
            s.id === id ? { ...s, [field]: { ...s[field], [subfield]: value } } : s
        ));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.hero.update", section.id), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Editar Hero" />

            <div className="px-8 py-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-semibold text-gray-800">Editar Slide Hero</h1>
                    <p className="text-gray-500 mt-1">Gestión completa del slider principal.</p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-10"
                >

                    {/* ── CONTENIDO GLOBAL (DEFAULT / FALLBACK) ── */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
                        <p className="font-semibold mb-1">Contenido global (fallback)</p>
                        <p>Si un slide no tiene contenido propio, se usará este texto como respaldo.</p>
                    </div>

                    <SectionTitle label="Título global" />
                    <LangInput
                        label="Título Español"
                        value={data.title.es}
                        onChange={val => setData("title", { ...data.title, es: val })}
                        error={errors["title.es"]}
                    />
                    <LangInput
                        label="Title English"
                        value={data.title.en}
                        onChange={val => setData("title", { ...data.title, en: val })}
                        error={errors["title.en"]}
                    />

                    <SectionTitle label="Subtítulo global" />
                    <LangInput
                        label="Subtítulo Español"
                        value={data.subtitle.es}
                        onChange={val => setData("subtitle", { ...data.subtitle, es: val })}
                        error={errors["subtitle.es"]}
                    />
                    <LangInput
                        label="Subtitle English"
                        value={data.subtitle.en}
                        onChange={val => setData("subtitle", { ...data.subtitle, en: val })}
                        error={errors["subtitle.en"]}
                    />

                    <SectionTitle label="Botón global" />
                    <LangInput
                        label="Texto Botón Español"
                        value={data.button_text.es}
                        onChange={val => setData("button_text", { ...data.button_text, es: val })}
                        error={errors["button_text.es"]}
                    />
                    <LangInput
                        label="Button Text English"
                        value={data.button_text.en}
                        onChange={val => setData("button_text", { ...data.button_text, en: val })}
                        error={errors["button_text.en"]}
                    />
                    <LangInput
                        label="Enlace del botón (ej: /productos)"
                        value={data.button_link}
                        onChange={val => setData("button_link", val)}
                        error={errors["button_link"]}
                    />

                    {/* ── SLIDES EXISTENTES ── */}
                    <SectionTitle label="Slides existentes" />

                    <div className="space-y-6">
                        {localImages.map((image) => {
                            const slideData = data.slide_data.find(s => s.id === image.id);

                            return (
                                <SlideCard
                                    key={image.id}
                                    image={image}
                                    slideData={slideData}
                                    onDelete={() => handleDeleteImage(image.id)}
                                    onReplaceImage={(file) => handleReplaceImage(image.id, file)}
                                    onUpdateField={(field, value) => updateSlideData(image.id, field, value)}
                                    onUpdateNestedField={(field, sub, value) => updateSlideNestedData(image.id, field, sub, value)}
                                    fileInputRef={(el) => (fileInputRefs.current[image.id] = el)}
                                />
                            );
                        })}
                    </div>

                    {/* ── RECOMENDACIÓN ── */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm text-blue-800">
                        <p className="font-semibold mb-2">Recomendación de imagen</p>
                        <p>
                            Recomendado <strong>1360 × 450 px</strong> •
                            Formatos <strong>JPG / PNG / WEBP</strong> •
                            Tamaño máximo <strong>3MB</strong>
                        </p>
                    </div>

                    {/* ── AGREGAR NUEVAS IMÁGENES ── */}
                    <SectionTitle label="Agregar nuevas imágenes (tipo imagen)" />

                    <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#25A7CA] transition">
                        <span className="text-gray-600 font-medium">
                            Hacer clic para agregar nuevas imágenes
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => handleNewImages(e.target.files)}
                            className="hidden"
                        />
                    </label>

                    {/* ── ACTIVE TOGGLE ── */}
                    <div className="flex items-center justify-between pt-6 border-t">
                        <div>
                            <div className="font-semibold text-gray-800">Slide Activo</div>
                            <div className="text-sm text-gray-500">Si está desactivado no será visible.</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setData("is_active", !data.is_active)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition
                                ${data.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                            {data.is_active ? "Activo" : "Inactivo"}
                        </button>
                    </div>

                    {/* ── GUARDAR ── */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#25A7CA] hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}


/* ────────────────────────────────────────────────
   SLIDE CARD COMPONENT
──────────────────────────────────────────────── */
function SlideCard({ image, slideData, onDelete, onReplaceImage, onUpdateField, onUpdateNestedField, fileInputRef }) {

    const [expanded, setExpanded] = useState(false);
    const localFileRef = useRef(null);

    const isVideo = slideData?.media_type === "video";

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">

            {/* Cabecera con preview y acciones */}
            <div className="flex gap-4 p-4 items-start">

                {/* Preview media */}
                <div className="w-48 h-28 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                    {isVideo && slideData?.video_url ? (
                        <iframe
                            src={slideData.video_url}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen; muted"
                            allowFullScreen
                            title="Video preview"
                        />
                    ) : (
                        <img
                            src={image.isPreview ? image.image : `/storage/${image.image}`}
                            alt="Slide"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => !image.isNew && localFileRef.current?.click()}
                        />
                    )}
                    {!image.isNew && !isVideo && (
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                            ref={(el) => { localFileRef.current = el; if (fileInputRef) fileInputRef(el); }}
                            onChange={(e) => onReplaceImage(e.target.files[0])}
                        />
                    )}
                </div>

                {/* Info y controles */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                        {slideData?.title?.es || <span className="text-gray-400 italic">Sin título</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Tipo: <span className="font-medium">{isVideo ? "Video" : "Imagen"}</span>
                    </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setExpanded(prev => !prev)}
                        className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                    >
                        {expanded ? "Cerrar" : "Editar"}
                    </button>
                    {!image.isNew && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="text-sm px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium"
                        >
                            Eliminar
                        </button>
                    )}
                </div>

            </div>

            {/* Panel expandido con campos de contenido */}
            {expanded && slideData && (
                <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-6">

                    {/* Tipo de media */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipo de media
                        </label>
                        <div className="flex gap-3">
                            {["image", "video"].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => onUpdateField("media_type", type)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition
                                        ${slideData.media_type === type
                                            ? "bg-[#25A7CA] text-white border-[#25A7CA]"
                                            : "bg-white text-gray-600 border-gray-300 hover:border-[#25A7CA]"
                                        }`}
                                >
                                    {type === "image" ? "🖼 Imagen" : "🎬 Video"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* URL de video (solo si es video) */}
                    {isVideo && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                URL de video (YouTube o Vimeo)
                            </label>
                            <input
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] focus:outline-none transition"
                                value={slideData.video_url}
                                onChange={(e) => onUpdateField("video_url", e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                El video se reproducirá automáticamente, sin sonido y en bucle.
                            </p>
                        </div>
                    )}

                    {/* Título del slide */}
                    <SectionTitle label="Título del slide" />
                    <LangInput
                        label="Título Español"
                        value={slideData.title?.es ?? ""}
                        onChange={val => onUpdateNestedField("title", "es", val)}
                    />
                    <LangInput
                        label="Title English"
                        value={slideData.title?.en ?? ""}
                        onChange={val => onUpdateNestedField("title", "en", val)}
                    />

                    {/* Subtítulo del slide */}
                    <SectionTitle label="Subtítulo del slide" />
                    <LangInput
                        label="Subtítulo Español"
                        value={slideData.subtitle?.es ?? ""}
                        onChange={val => onUpdateNestedField("subtitle", "es", val)}
                    />
                    <LangInput
                        label="Subtitle English"
                        value={slideData.subtitle?.en ?? ""}
                        onChange={val => onUpdateNestedField("subtitle", "en", val)}
                    />

                    {/* Botón del slide */}
                    <SectionTitle label="Botón del slide" />
                    <LangInput
                        label="Texto Botón Español"
                        value={slideData.button_text?.es ?? ""}
                        onChange={val => onUpdateNestedField("button_text", "es", val)}
                    />
                    <LangInput
                        label="Button Text English"
                        value={slideData.button_text?.en ?? ""}
                        onChange={val => onUpdateNestedField("button_text", "en", val)}
                    />
                    <LangInput
                        label="Enlace del botón (ej: /productos)"
                        value={slideData.button_link ?? ""}
                        onChange={val => onUpdateField("button_link", val)}
                    />

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                        Si los campos de este slide están vacíos, se usará el contenido global como respaldo.
                    </div>

                </div>
            )}

        </div>
    );
}


/* ────────────────────────────────────────────────
   COMPONENTES COMPARTIDOS
──────────────────────────────────────────────── */
function SectionTitle({ label }) {
    return (
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">{label}</h2>
    );
}

function LangInput({ label, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] focus:outline-none transition"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
    );
}
