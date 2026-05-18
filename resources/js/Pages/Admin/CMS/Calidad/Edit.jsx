import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminFileField,
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

const normalizeLang = (field) => ({
    es: field?.es ?? "",
    en: field?.en ?? "",
});

export default function Edit({ section }) {
    const { data, setData, put, processing, errors } = useForm({
        title: normalizeLang(section?.title),
        subtitle: normalizeLang(section?.subtitle),
        content: normalizeLang(section?.content),
        image: null,
        is_active: Boolean(section?.is_active),
    });

    const submit = (event) => {
        event.preventDefault();

        put(route("admin.cms.calidad.update"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Calidad" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Página de calidad"
                    description="Editá el bloque principal de la página Calidad con textos claros, imagen institucional y estado de publicación."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Contenido principal"
                        description="Completá el título, subtítulo y desarrollo del bloque principal en español e inglés."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título"
                                value={data.title.es}
                                onChange={(value) => setData("title", { ...data.title, es: value })}
                                placeholder="Ej: Calidad certificada en cada proceso"
                                error={errors["title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.title.en}
                                onChange={(value) => setData("title", { ...data.title, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["title.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Subtítulo"
                                value={data.subtitle.es}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, es: value })}
                                placeholder="Una bajada breve para acompañar el título"
                                error={errors["subtitle.es"]}
                            />
                            <AdminTextInput
                                label="Subtítulo en inglés"
                                value={data.subtitle.en}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["subtitle.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Contenido"
                                value={data.content.es}
                                onChange={(value) => setData("content", { ...data.content, es: value })}
                                placeholder="Describí las políticas, certificaciones o compromisos de calidad."
                                error={errors["content.es"]}
                            />
                            <AdminRichTextarea
                                label="Contenido en inglés"
                                value={data.content.en}
                                onChange={(value) => setData("content", { ...data.content, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["content.en"]}
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Imagen y publicación"
                        description="Podés actualizar la imagen principal y decidir si este bloque queda activo en la vista pública."
                        tone="accent"
                    >
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                            <AdminFileField
                                label="Imagen principal"
                                value={data.image}
                                onChange={(file) => setData("image", file)}
                                accept="image/png,image/jpeg,image/webp"
                                maxSizeMB={5}
                                currentUrl={section?.image ? `/storage/${section.image}` : null}
                                currentLabel="Imagen actual de la sección"
                                hint="Usá una imagen limpia y representativa del proceso o certificación."
                                error={errors.image}
                            />

                            <AdminToggle
                                label="Mostrar sección en la web"
                                hint="Si lo desactivás, el contenido sigue guardado pero deja de verse públicamente."
                                checked={data.is_active}
                                onChange={(value) => setData("is_active", value)}
                            />
                        </div>
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Guardando cambios..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
