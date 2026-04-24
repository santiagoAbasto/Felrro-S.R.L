import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminFileField,
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
} from "@/Components/Admin/FormElements";

const normalizeLang = (field) => ({
    es: field?.es ?? "",
    en: field?.en ?? "",
});

export default function Edit({ section }) {
    const { data, setData, put, processing, errors } = useForm({
        id: section?.id ?? "",
        title: normalizeLang(section?.title),
        subtitle: normalizeLang(section?.subtitle),
        content: normalizeLang(section?.content),
        button_text: normalizeLang(section?.button_text),
        button_link: section?.button_link ?? "",
        image: null,
    });

    const submit = (event) => {
        event.preventDefault();

        put(route("admin.cms.home.update"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Nosotros en Inicio" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Inicio"
                    title="Nosotros en Inicio"
                    description="Este bloque corresponde al resumen institucional que aparece dentro del inicio. No modifica la página completa de Nosotros."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Textos principales"
                        description="Completá primero la versión en español. La versión en inglés se puede dejar preparada para usar cuando la necesites."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título principal"
                                value={data.title.es}
                                onChange={(value) => setData("title", { ...data.title, es: value })}
                                placeholder="Ej: Más de 40 años fabricando soluciones eléctricas confiables"
                                hint="Es el texto más importante del bloque."
                                error={errors["title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.title.en}
                                onChange={(value) => setData("title", { ...data.title, en: value })}
                                placeholder="Versión en inglés"
                                hint="Podés completarlo ahora o dejarlo para más adelante."
                                error={errors["title.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Subtítulo"
                                value={data.subtitle.es}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, es: value })}
                                placeholder="Una frase corta para acompañar el título"
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
                                label="Texto descriptivo"
                                value={data.content.es}
                                onChange={(value) => setData("content", { ...data.content, es: value })}
                                placeholder="Contá en pocas líneas qué hace Felrro y por qué elegirla."
                                hint="Podés usar el editor guiado para separar párrafos o crear listas simples."
                                error={errors["content.es"]}
                            />
                            <AdminRichTextarea
                                label="Texto descriptivo en inglés"
                                value={data.content.en}
                                onChange={(value) => setData("content", { ...data.content, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["content.en"]}
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Botón de acción"
                        description="Definí el texto visible y el enlace hacia donde querés llevar al visitante."
                        tone="accent"
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Texto del botón"
                                value={data.button_text.es}
                                onChange={(value) => setData("button_text", { ...data.button_text, es: value })}
                                placeholder="Ej: Ver más"
                                error={errors["button_text.es"]}
                            />
                            <AdminTextInput
                                label="Texto del botón en inglés"
                                value={data.button_text.en}
                                onChange={(value) => setData("button_text", { ...data.button_text, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["button_text.en"]}
                                optional
                            />
                        </div>

                        <AdminTextInput
                            label="Destino del botón"
                            value={data.button_link}
                            onChange={(value) => setData("button_link", value)}
                            placeholder="Ej: /nosotros"
                            hint="Podés usar un enlace interno del sitio, por ejemplo /nosotros o /productos."
                            error={errors.button_link}
                        />
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Imagen"
                        description="La vista previa te ayuda a confirmar antes de guardar. La imagen actual se mantiene hasta que elijas una nueva."
                    >
                        <AdminFileField
                            label="Imagen del bloque"
                            value={data.image}
                            onChange={(file) => setData("image", file)}
                            accept="image/png,image/jpeg,image/webp"
                            maxSizeMB={5}
                            currentUrl={section?.image ? `/storage/${section.image}` : null}
                            currentLabel="Imagen actual del bloque"
                            hint="Formatos admitidos: JPG, PNG o WEBP."
                            error={errors.image}
                        />
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
