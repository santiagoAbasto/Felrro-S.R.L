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

const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Create() {
    const [uploadError, setUploadError] = useState("");
    const [previewUrls, setPreviewUrls] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        title: { es: "", en: "" },
        subtitle: { es: "", en: "" },
        button_text: { es: "", en: "" },
        button_link: "",
        is_active: true,
        images: [],
    });

    useEffect(() => {
        const urls = data.images.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [data.images]);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Solo se admiten imágenes JPG, PNG o WEBP.";
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return `Cada imagen puede pesar hasta ${MAX_SIZE_MB} MB.`;
        }
        return null;
    };

    const handleImages = (files) => {
        const valid = [];
        const invalidMessages = [];

        Array.from(files).forEach((file) => {
            const error = validateFile(file);
            if (error) {
                invalidMessages.push(`${file.name}: ${error}`);
                return;
            }
            valid.push(file);
        });

        setUploadError(invalidMessages.join(" "));
        if (valid.length > 0) {
            setData("images", [...data.images, ...valid]);
        }
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
                        title="Imágenes iniciales"
                        description="Podés cargar una o varias imágenes. El panel rechaza automáticamente las que superen el peso permitido."
                        tone="accent"
                    >
                        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]">
                                    Seleccionar imágenes
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(event) => handleImages(event.target.files)}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-slate-400">
                                    Recomendado: 1360 × 450 px. Máximo 3 MB por imagen.
                                </span>
                            </div>

                            {uploadError ? <p className="mt-3 text-xs font-medium text-red-500">{uploadError}</p> : null}
                            {errors.images ? <p className="mt-3 text-xs font-medium text-red-500">{errors.images}</p> : null}

                            {previewUrls.length > 0 ? (
                                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {previewUrls.map((url, index) => (
                                        <div key={url} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
                                            <img src={url} alt={`Vista previa ${index + 1}`} className="h-40 w-full object-cover" />
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <p className="truncate text-sm text-slate-500">{data.images[index]?.name}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setData("images", data.images.filter((_, itemIndex) => itemIndex !== index))}
                                                    className="text-xs font-semibold text-red-500 transition hover:text-red-600"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
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
