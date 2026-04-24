import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminFileField,
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function Edit({ section }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        title: section?.title ?? { es: "", en: "" },
        subtitle: section?.subtitle ?? { es: "", en: "" },
        content: section?.content ?? { es: "", en: "" },
        image: null,
        is_active: section?.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.cms.calidad.update"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Calidad" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Calidad"
                    title="Contenido principal de Calidad"
                    description="Acá editás el bloque superior de la página Calidad. Los certificados y sus archivos se gestionan por separado."
                    actions={[
                        <Link
                            key="list"
                            href={route("admin.certificates.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Ver certificados
                        </Link>,
                        <Link
                            key="create"
                            href={route("admin.certificates.create")}
                            className="rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                        >
                            Nuevo certificado
                        </Link>,
                    ]}
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Texto del encabezado"
                        description="Usá un mensaje breve y claro para presentar la política de calidad."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título"
                                value={data.title.es}
                                onChange={(value) => setData("title", { ...data.title, es: value })}
                                placeholder="Ej: Calidad certificada"
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
                            <AdminRichTextarea
                                label="Introducción"
                                value={data.subtitle.es}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, es: value })}
                                placeholder="Explicá en pocas líneas el enfoque de calidad."
                                error={errors["subtitle.es"]}
                            />
                            <AdminRichTextarea
                                label="Introducción en inglés"
                                value={data.subtitle.en}
                                onChange={(value) => setData("subtitle", { ...data.subtitle, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["subtitle.en"]}
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Puntos o políticas"
                        description="Podés escribir un párrafo o usar una lista con un punto por línea."
                        tone="accent"
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Contenido"
                                value={data.content.es}
                                onChange={(value) => setData("content", { ...data.content, es: value })}
                                placeholder="Describí compromisos, procesos o políticas de calidad."
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
                        title="Imagen lateral"
                        description="La imagen acompaña el texto en la parte pública, por eso conviene revisar la vista previa antes de guardar."
                    >
                        <AdminFileField
                            label="Imagen"
                            value={data.image}
                            onChange={(file) => setData("image", file)}
                            accept="image/png,image/jpeg,image/webp"
                            maxSizeMB={5}
                            currentUrl={section?.image ? `/storage/${section.image}` : null}
                            currentLabel="Imagen actual de la sección"
                            hint="Formatos admitidos: JPG, PNG o WEBP."
                            error={errors.image}
                        />

                        <AdminToggle
                            label="Mostrar esta sección en la web"
                            hint="Si la dejás oculta, no se verá en la página pública."
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
                            {processing ? "Guardando cambios..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
