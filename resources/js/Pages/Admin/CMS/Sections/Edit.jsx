import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState } from "react";

export default function Edit({ section }) {

    const { data, setData, put, processing, errors } = useForm({
        page_id: section.page_id,
        type: section.type,
        title: section.title ?? { es: "", en: "" },
        subtitle: section.subtitle ?? { es: "", en: "" },
        content: section.content ?? { es: "", en: "" },
        button_text: section.button_text ?? { es: "", en: "" },
        button_link: section.button_link ?? "",
        images: [],
        deleted_images: []
    });

    /* ================= IMÁGENES ================= */

    const [previews, setPreviews] = useState(
        section.images
            ? section.images.map(img => ({
                id: img.id,
                url: img.image_url,
                existing: true
            }))
            : []
    );

    const [deletedImages, setDeletedImages] = useState([]);

    /* ================= AGREGAR IMÁGENES ================= */

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const updatedPreviews = [...previews];
        const updatedFiles = [...data.images];

        files.forEach(file => {

            if (file.size > 5 * 1024 * 1024) {
                alert(`La imagen ${file.name} supera los 5MB.`);
                return;
            }

            updatedPreviews.push({
                url: URL.createObjectURL(file),
                existing: false
            });

            updatedFiles.push(file); // 👈 SOLO file puro
        });

        setPreviews(updatedPreviews);
        setData("images", updatedFiles);
    };

    /* ================= ELIMINAR IMAGEN ================= */

    const removeImage = (index) => {

        const image = previews[index];

        // Si es imagen existente, enviamos ID para borrar en backend
        if (image.existing && image.id) {
            setDeletedImages(prev => [...prev, image.id]);
            setData("deleted_images", [...deletedImages, image.id]);
        }

        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    /* ================= SUBMIT ================= */

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.page-sections.update", section.id), {
            forceFormData: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar Sección" />

            <div className="p-10 bg-gray-50 min-h-screen">
                <div className="max-w-6xl space-y-10">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Editar Sección
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Tipo: {section.type}
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10"
                    >

                        {/* ================= TÍTULO ================= */}
                        <SectionTitle label="Título" />

                        <LangInput
                            label="Título Español"
                            value={data.title.es}
                            onChange={(val) =>
                                setData("title", { ...data.title, es: val })
                            }
                            error={errors["title.es"]}
                        />

                        <LangInput
                            label="Title English"
                            value={data.title.en}
                            onChange={(val) =>
                                setData("title", { ...data.title, en: val })
                            }
                            error={errors["title.en"]}
                        />

                        {/* ================= CONTENIDO ================= */}
                        <SectionTitle label="Contenido" />

                        <LangTextarea
                            label="Contenido Español"
                            value={data.content?.es}
                            onChange={(val) =>
                                setData("content", { ...data.content, es: val })
                            }
                        />

                        <LangTextarea
                            label="Content English"
                            value={data.content?.en}
                            onChange={(val) =>
                                setData("content", { ...data.content, en: val })
                            }
                        />

                        {/* ================= BOTÓN ================= */}
                        <SectionTitle label="Botón" />

                        <LangInput
                            label="Texto botón ES"
                            value={data.button_text?.es}
                            onChange={(val) =>
                                setData("button_text", { ...data.button_text, es: val })
                            }
                        />

                        <LangInput
                            label="Button text EN"
                            value={data.button_text?.en}
                            onChange={(val) =>
                                setData("button_text", { ...data.button_text, en: val })
                            }
                        />

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Link del botón
                            </label>
                            <input
                                value={data.button_link}
                                onChange={(e) => setData("button_link", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* ================= IMÁGENES HERO ENTERPRISE ================= */}
                        <SectionTitle label="Imágenes del Hero" />

                        <div className="space-y-4">

                            {/* INFO PANEL */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                                <p className="font-semibold mb-1">Requisitos recomendados </p>
                                <ul className="list-disc ml-5 space-y-1">
                                    <li>Resolución recomendada: <strong>496 x 496 px</strong></li>
                                    <li>Formato permitido: JPG, PNG, WEBP</li>
                                    <li>Peso máximo: 5MB por imagen</li>
                                    <li>Relación cuadrada recomendada (1:1)</li>
                                </ul>
                            </div>

                            {/* PREVIEWS */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                                {previews.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative group border rounded-2xl overflow-hidden shadow-sm bg-white"
                                    >
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={img.url}
                                                className="w-full h-full object-cover"
                                                alt="Preview"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* UPLOAD AREA */}
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition">

                                <div className="space-y-3">

                                    <div className="text-gray-600">
                                        Arrastra imágenes aquí o
                                    </div>

                                    <label
                                        htmlFor="heroUpload"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700 cursor-pointer transition"
                                    >
                                        Seleccionar imágenes
                                    </label>

                                    <input
                                        id="heroUpload"
                                        type="file"
                                        name="images[]"
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    <p className="text-xs text-gray-500">
                                        JPG · PNG · WEBP — Máx 5MB — 496x496 recomendado
                                    </p>

                                </div>
                            </div>

                            {errors["images.*"] && (
                                <div className="text-red-500 text-sm">
                                    {errors["images.*"]}
                                </div>
                            )}
                        </div>

                        {/* ================= GUARDAR ================= */}
                        <div className="pt-6 border-t">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                            >
                                {processing ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}


/* ================= COMPONENTES ================= */

function SectionTitle({ label }) {
    return (
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {label}
        </h2>
    );
}

function LangInput({ label, value, onChange, error }) {
    return (
        <div>
            <label className="block font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {error && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}
        </div>
    );
}

function LangTextarea({ label, value, onChange }) {
    return (
        <div>
            <label className="block font-medium text-gray-700 mb-2">
                {label}
            </label>
            <textarea
                rows={5}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>
    );
}