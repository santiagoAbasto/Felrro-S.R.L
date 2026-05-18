import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

const IMAGE_MAX_SIZE_MB = 3;
const VIDEO_MAX_SIZE_MB = 100;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const emptySlide = () => ({
    id: `${Date.now()}-${Math.random()}`,
    media_type: "image",
    image: null,
    video_file: null,
    video_url: "",
});

export default function Create() {
    const [uploadError, setUploadError] = useState("");
    const [slides, setSlides] = useState([emptySlide()]);

    const { data, setData, post, processing, errors } = useForm({
        title: { es: "", en: "" },
        subtitle: { es: "", en: "" },
        button_text: { es: "", en: "" },
        button_link: "",
        is_active: true,
        slides: [],
    });

    useEffect(() => {
        setData("slides", slides.map(({ id, ...slide }) => slide));
    }, [slides]);

    const validateImage = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Solo se admiten imágenes JPG, PNG o WEBP.";
        }
        if (file.size > IMAGE_MAX_SIZE_MB * 1024 * 1024) {
            return `Cada imagen puede pesar hasta ${IMAGE_MAX_SIZE_MB} MB.`;
        }
        return null;
    };

    const validateVideo = (file) => {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            return "Solo se admiten videos MP4, MOV o WEBM.";
        }
        if (file.size > VIDEO_MAX_SIZE_MB * 1024 * 1024) {
            return `Cada video puede pesar hasta ${VIDEO_MAX_SIZE_MB} MB.`;
        }
        return null;
    };

    const updateSlide = (id, patch) => {
        setSlides((current) => current.map((slide) => (
            slide.id === id ? { ...slide, ...patch } : slide
        )));
    };

    const setSlideFile = (id, file, kind) => {
        if (!file) return;

        const error = kind === "video" ? validateVideo(file) : validateImage(file);
        if (error) {
            setUploadError(`${file.name}: ${error}`);
            return;
        }

        setUploadError("");
        updateSlide(id, kind === "video"
            ? { media_type: "video", video_file: file, video_url: "", image: null }
            : { media_type: "image", image: file, video_file: null, video_url: "" }
        );
    };

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.hero.store"), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Nuevo slider" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Inicio"
                    title="Nuevo slider"
                    description="Creá un bloque nuevo para el inicio. Podés dejar el texto preparado y sumar varias imágenes con vista previa."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Contenido general"
                        description="Este texto funciona como base del slider y se usa cuando una imagen no tiene contenido propio."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título"
                                value={data.title.es}
                                onChange={(value) => setData("title", { ...data.title, es: value })}
                                error={errors["title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.title.en}
                                onChange={(value) => setData("title", { ...data.title, en: value })}
                                error={errors["title.en"]}
                                optional
                            />
                        </div>
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Subtítulo"
                                value={data.subtitle.es}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, es: value })}
                                error={errors["subtitle.es"]}
                            />
                            <AdminTextInput
                                label="Subtítulo en inglés"
                                value={data.subtitle.en}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, en: value })}
                                error={errors["subtitle.en"]}
                                optional
                            />
                        </div>
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Texto del botón"
                                value={data.button_text.es}
                                onChange={(value) => setData("button_text", { ...data.button_text, es: value })}
                                error={errors["button_text.es"]}
                            />
                            <AdminTextInput
                                label="Texto del botón en inglés"
                                value={data.button_text.en}
                                onChange={(value) => setData("button_text", { ...data.button_text, en: value })}
                                error={errors["button_text.en"]}
                                optional
                            />
                        </div>

                        <AdminTextInput
                            label="Destino del botón"
                            value={data.button_link}
                            onChange={(value) => setData("button_link", value)}
                            placeholder="Ej: /productos"
                            error={errors.button_link}
                            optional
                        />
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Slides iniciales"
                        description="Podés cargar imágenes, videos locales o enlaces de YouTube/Vimeo embebidos para el slider del inicio."
                        tone="accent"
                    >
                        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-5">
                            <div className="space-y-5">
                                {slides.map((slide, index) => (
                                    <SlideMediaInput
                                        key={slide.id}
                                        slide={slide}
                                        index={index}
                                        onTypeChange={(mediaType) => updateSlide(slide.id, {
                                            media_type: mediaType,
                                            image: null,
                                            video_file: null,
                                            video_url: "",
                                        })}
                                        onImageChange={(file) => setSlideFile(slide.id, file, "image")}
                                        onVideoChange={(file) => setSlideFile(slide.id, file, "video")}
                                        onUrlChange={(value) => updateSlide(slide.id, {
                                            media_type: "video",
                                            video_url: value,
                                            video_file: null,
                                            image: null,
                                        })}
                                        onRemove={() => setSlides((current) => current.filter((item) => item.id !== slide.id))}
                                        canRemove={slides.length > 1}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setSlides((current) => [...current, emptySlide()])}
                                className="mt-5 inline-flex items-center rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                            >
                                Agregar slide
                            </button>

                            {uploadError ? <p className="mt-3 text-xs font-medium text-red-500">{uploadError}</p> : null}
                            {errors.slides ? <p className="mt-3 text-xs font-medium text-red-500">{errors.slides}</p> : null}
                            <p className="mt-4 text-xs text-slate-400">
                                Recomendado para imagen y video: 1360 × 450 px. Imágenes hasta 3 MB. Videos hasta 100 MB.
                            </p>
                        </div>

                        <AdminToggle
                            label="Mostrar este slider en el inicio"
                            hint="Si está activo, podrá mostrarse según el orden configurado."
                            checked={data.is_active}
                            onChange={(value) => setData("is_active", value)}
                        />
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Creando slider..." : "Guardar slider"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function SlideMediaInput({ slide, index, onTypeChange, onImageChange, onVideoChange, onUrlChange, onRemove, canRemove }) {
    const imagePreview = slide.image ? URL.createObjectURL(slide.image) : null;
    const videoPreview = slide.video_file ? URL.createObjectURL(slide.video_file) : null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">Slide {index + 1}</p>
                {canRemove ? (
                    <button type="button" onClick={onRemove} className="text-xs font-semibold text-red-500 transition hover:text-red-600">
                        Quitar
                    </button>
                ) : null}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {["image", "video"].map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onTypeChange(type)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                            slide.media_type === type
                                ? "border-[#25A7CA] bg-[#25A7CA] text-white"
                                : "border-slate-300 bg-white text-slate-600 hover:border-[#25A7CA]"
                        }`}
                    >
                        {type === "image" ? "Imagen" : "Video"}
                    </button>
                ))}
            </div>

            {slide.media_type === "image" ? (
                <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-500 transition hover:border-[#25A7CA]">
                    Seleccionar imagen
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onImageChange(event.target.files[0])} className="hidden" />
                </label>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-500 transition hover:border-[#25A7CA]">
                        Seleccionar video local
                        <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={(event) => onVideoChange(event.target.files[0])} className="hidden" />
                    </label>
                    <input
                        type="url"
                        value={slide.video_url}
                        onChange={(event) => onUrlChange(event.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#25A7CA] focus:outline-none focus:ring-2 focus:ring-[#25A7CA]/20"
                    />
                </div>
            )}

            {imagePreview ? <img src={imagePreview} alt="" className="mt-4 h-40 w-full rounded-xl object-cover" /> : null}
            {videoPreview ? <video src={videoPreview} className="mt-4 h-40 w-full rounded-xl object-cover" muted controls /> : null}
        </div>
    );
}
