import AdminLayout from "@/Layouts/AdminLayout";
import {
    AdminFileField,
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Edit({ section, pages = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        page_id: section.page_id || "",
        type: section.type || "",
        title: section.title || { es: "", en: "" },
        subtitle: section.subtitle || { es: "", en: "" },
        content: section.content || { es: "", en: "" },
        button_text: section.button_text || { es: "", en: "" },
        button_link: section.button_link || "",
        order: section.order || "",
        is_active: Boolean(section.is_active),
        image: null,
        existing_image: section.image_url || null,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.page-sections.update", section.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar sección" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="CMS"
                    title="Editar sección"
                    description="Actualizá el contenido general de esta sección del sitio."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard title="Ubicación y estado">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">
                                    Página
                                </label>
                                <select
                                    value={data.page_id}
                                    onChange={(event) => setData("page_id", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                                >
                                    <option value="">Seleccionar página</option>
                                    {pages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            {page.slug}
                                        </option>
                                    ))}
                                </select>
                                {errors.page_id ? <p className="mt-2 text-xs text-red-500">{errors.page_id}</p> : null}
                            </div>

                            <AdminTextInput
                                label="Tipo"
                                value={data.type}
                                onChange={(value) => setData("type", value)}
                                error={errors.type}
                            />

                            <AdminTextInput
                                label="Orden"
                                value={data.order}
                                onChange={(value) => setData("order", value)}
                                error={errors.order}
                                optional
                            />

                            <AdminToggle
                                label="Mostrar sección"
                                checked={data.is_active}
                                onChange={(value) => setData("is_active", value)}
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard title="Textos">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título"
                                value={data.title.es}
                                onChange={(value) => setData("title", { ...data.title, es: value })}
                                error={errors["title.es"]}
                                optional
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.title.en}
                                onChange={(value) => setData("title", { ...data.title, en: value })}
                                error={errors["title.en"]}
                                optional
                            />
                            <AdminTextInput
                                label="Subtítulo"
                                value={data.subtitle.es}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, es: value })}
                                error={errors["subtitle.es"]}
                                optional
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
                            <AdminRichTextarea
                                label="Contenido"
                                value={data.content.es || ""}
                                onChange={(value) => setData("content", { ...data.content, es: value })}
                                error={errors["content.es"]}
                                optional
                            />
                            <AdminRichTextarea
                                label="Contenido en inglés"
                                value={data.content.en || ""}
                                onChange={(value) => setData("content", { ...data.content, en: value })}
                                error={errors["content.en"]}
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard title="Botón e imagen">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Texto del botón"
                                value={data.button_text.es}
                                onChange={(value) => setData("button_text", { ...data.button_text, es: value })}
                                optional
                            />
                            <AdminTextInput
                                label="Texto del botón en inglés"
                                value={data.button_text.en}
                                onChange={(value) => setData("button_text", { ...data.button_text, en: value })}
                                optional
                            />
                        </div>

                        <AdminTextInput
                            label="Enlace del botón"
                            value={data.button_link}
                            onChange={(value) => setData("button_link", value)}
                            optional
                        />

                        <AdminFileField
                            label="Imagen"
                            value={data.image}
                            onChange={(file) => setData("image", file)}
                            accept="image/png,image/jpeg,image/webp"
                            currentUrl={data.existing_image}
                            currentLabel={data.existing_image ? "Imagen actual" : null}
                            maxSizeMB={5}
                            optional
                            error={errors.image}
                        />
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Guardando..." : "Guardar sección"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
