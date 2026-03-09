import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState } from "react";

const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        title:       { es: "", en: "" },
        subtitle:    { es: "", en: "" },
        button_text: { es: "", en: "" },
        button_link: "",
        is_active:   true,
        images:      [],
    });

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type))
            return "Formato no permitido (JPG, PNG, WEBP)";
        if (file.size > MAX_SIZE_MB * 1024 * 1024)
            return `La imagen supera el máximo de ${MAX_SIZE_MB}MB`;
        return null;
    };

    const handleImages = (files) => {
        const valid = [];
        Array.from(files).forEach(file => {
            const err = validateFile(file);
            if (!err) valid.push(file);
            else alert(err);
        });
        setData("images", [...data.images, ...valid]);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.hero.store"), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Nuevo Hero Slider" />

            <div className="px-8 py-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Nuevo Slider Hero
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Crea un nuevo grupo de slides para el hero del Home.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-10"
                >

                    {/* ── TÍTULO ── */}
                    <SectionTitle label="Título" />
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

                    {/* ── SUBTÍTULO ── */}
                    <SectionTitle label="Subtítulo" />
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

                    {/* ── BOTÓN ── */}
                    <SectionTitle label="Botón" />
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

                    {/* ── IMÁGENES INICIALES ── */}
                    <SectionTitle label="Imágenes iniciales (opcional)" />

                    <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#25A7CA] transition">
                        <span className="text-gray-600 font-medium">
                            Hacer clic para agregar imágenes
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            onChange={e => handleImages(e.target.files)}
                            className="hidden"
                        />
                    </label>

                    {data.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {data.images.map((file, i) => (
                                <div key={i} className="relative border border-gray-200 rounded-xl overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${i}`}
                                        className="w-full h-32 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setData("images", data.images.filter((_, j) => j !== i))}
                                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Recomendación de imagen</p>
                        <p>
                            Recomendado <strong>1360 × 450 px</strong> •
                            Formatos <strong>JPG / PNG / WEBP</strong> •
                            Máximo <strong>3MB</strong>
                        </p>
                    </div>

                    {/* ── ESTADO ── */}
                    <div className="flex items-center justify-between pt-6 border-t">
                        <div>
                            <div className="font-semibold text-gray-800">Activo</div>
                            <div className="text-sm text-gray-500">
                                Si está activo se mostrará en el Home (solo se muestra el primero activo por orden).
                            </div>
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
                            {processing ? "Creando..." : "Crear Slider"}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}

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
                onChange={e => onChange(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
    );
}
