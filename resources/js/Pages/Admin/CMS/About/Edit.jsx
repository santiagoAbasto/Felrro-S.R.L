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

export default function Edit({ page }) {
    const main = page?.sections?.find((section) => section.type === "about_main") || {};
    const metrics = page?.sections?.find((section) => section.type === "about_metrics") || {};
    const valuesSection = page?.sections?.find((section) => section.type === "about_values") || {};
    const video = page?.sections?.find((section) => section.type === "about_video") || {};

    const { data, setData, put, processing, errors } = useForm({
        main: {
            id: main.id,
            title: main.title ?? { es: "", en: "" },
            content: main.content ?? { es: "", en: "" },
            image: null,
            existing_image: main.image ?? null,
        },
        metrics: {
            id: metrics.id,
            items: metrics.content?.items ?? [],
        },
        values: {
            id: valuesSection.id,
            mission: valuesSection.content?.mission ?? { es: "", en: "" },
            vision: valuesSection.content?.vision ?? { es: "", en: "" },
            values: valuesSection.content?.values ?? { es: "", en: "" },
        },
        video: {
            id: video.id,
            title: video.content?.title ?? { es: "", en: "" },
            url: video.content?.url ?? "",
            video_file: null,
            existing_video: video.content?.video_path ?? null,
        },
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.about.update"), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Nosotros" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Nosotros"
                    title="Página institucional"
                    description="Desde acá podés editar los bloques principales de la página Nosotros sin usar lenguaje técnico. Todo queda con vista previa antes de guardar."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Presentación principal"
                        description="Es la parte inicial de la página, donde contás quiénes son y qué hace la empresa."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título principal"
                                value={data.main.title.es}
                                onChange={(value) =>
                                    setData("main", {
                                        ...data.main,
                                        title: { ...data.main.title, es: value },
                                    })
                                }
                                placeholder="Ej: Trayectoria, calidad y compromiso"
                                error={errors["main.title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.main.title.en}
                                onChange={(value) =>
                                    setData("main", {
                                        ...data.main,
                                        title: { ...data.main.title, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["main.title.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Descripción principal"
                                value={data.main.content.es}
                                onChange={(value) =>
                                    setData("main", {
                                        ...data.main,
                                        content: { ...data.main.content, es: value },
                                    })
                                }
                                placeholder="Contá la historia, propuesta y experiencia de Felrro."
                                error={errors["main.content.es"]}
                            />
                            <AdminRichTextarea
                                label="Descripción principal en inglés"
                                value={data.main.content.en}
                                onChange={(value) =>
                                    setData("main", {
                                        ...data.main,
                                        content: { ...data.main.content, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["main.content.en"]}
                                optional
                            />
                        </div>

                        <AdminFileField
                            label="Imagen principal"
                            value={data.main.image}
                            onChange={(file) => setData("main", { ...data.main, image: file })}
                            accept="image/png,image/jpeg,image/webp"
                            maxSizeMB={5}
                            currentUrl={data.main.existing_image ? `/storage/${data.main.existing_image}` : null}
                            currentLabel="Imagen actual de la sección"
                            hint="Elegí una imagen horizontal, clara y representativa."
                            error={errors["main.image"]}
                        />
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Métricas o destacados"
                        description="Estos números ayudan a resumir trayectoria, capacidad o cobertura. Mantené textos breves para que se lean fácil."
                        tone="soft"
                    >
                        <div className="space-y-5">
                            {data.metrics.items.map((item, index) => (
                                <div key={index} className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 lg:grid-cols-3">
                                    <AdminTextInput
                                        label={`Valor ${index + 1}`}
                                        value={item.value}
                                        onChange={(value) => {
                                            const updated = [...data.metrics.items];
                                            updated[index].value = value;
                                            setData("metrics", { ...data.metrics, items: updated });
                                        }}
                                        placeholder="Ej: +40"
                                    />
                                    <AdminTextInput
                                        label={`Etiqueta ${index + 1}`}
                                        value={item.label?.es ?? ""}
                                        onChange={(value) => {
                                            const updated = [...data.metrics.items];
                                            updated[index].label = { ...(updated[index].label ?? {}), es: value };
                                            setData("metrics", { ...data.metrics, items: updated });
                                        }}
                                        placeholder="Ej: años de trayectoria"
                                    />
                                    <AdminTextInput
                                        label={`Etiqueta ${index + 1} en inglés`}
                                        value={item.label?.en ?? ""}
                                        onChange={(value) => {
                                            const updated = [...data.metrics.items];
                                            updated[index].label = { ...(updated[index].label ?? {}), en: value };
                                            setData("metrics", { ...data.metrics, items: updated });
                                        }}
                                        placeholder="Versión en inglés"
                                        optional
                                    />
                                </div>
                            ))}
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Misión, visión y valores"
                        description="Usá frases claras, concretas y fáciles de entender. La vista previa te ayuda a revisar el tono antes de publicar."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Misión"
                                value={data.values.mission.es}
                                onChange={(value) =>
                                    setData("values", {
                                        ...data.values,
                                        mission: { ...data.values.mission, es: value },
                                    })
                                }
                                placeholder="¿Cuál es el propósito de la empresa?"
                                error={errors["values.mission.es"]}
                            />
                            <AdminRichTextarea
                                label="Misión en inglés"
                                value={data.values.mission.en}
                                onChange={(value) =>
                                    setData("values", {
                                        ...data.values,
                                        mission: { ...data.values.mission, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["values.mission.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Visión"
                                value={data.values.vision.es}
                                onChange={(value) =>
                                    setData("values", {
                                        ...data.values,
                                        vision: { ...data.values.vision, es: value },
                                    })
                                }
                                placeholder="¿Hacia dónde quiere crecer la empresa?"
                                error={errors["values.vision.es"]}
                            />
                            <AdminRichTextarea
                                label="Visión en inglés"
                                value={data.values.vision.en}
                                onChange={(value) =>
                                    setData("values", {
                                        ...data.values,
                                        vision: { ...data.values.vision, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["values.vision.en"]}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminRichTextarea
                                label="Valores"
                                value={data.values.values.es}
                                onChange={(value) =>
                                    setData("values", {
                                        ...data.values,
                                        values: { ...data.values.values, es: value },
                                    })
                                }
                                placeholder="Podés usar una lista simple con un valor por línea."
                                error={errors["values.values.es"]}
                            />
                            <AdminRichTextarea
                                label="Valores en inglés"
                                value={data.values.values.en}
                                onChange={(value) =>
                                    setData("values", {
                                        ...data.values,
                                        values: { ...data.values.values, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["values.values.en"]}
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Video o enlace"
                        description="Podés mantener un enlace externo o subir un archivo propio. Si subís un archivo, el panel te muestra una vista previa."
                        tone="accent"
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título del bloque"
                                value={data.video.title.es}
                                onChange={(value) =>
                                    setData("video", {
                                        ...data.video,
                                        title: { ...data.video.title, es: value },
                                    })
                                }
                                placeholder="Ej: Conocé nuestra planta"
                                error={errors["video.title.es"]}
                                optional
                            />
                            <AdminTextInput
                                label="Título del bloque en inglés"
                                value={data.video.title.en}
                                onChange={(value) =>
                                    setData("video", {
                                        ...data.video,
                                        title: { ...data.video.title, en: value },
                                    })
                                }
                                placeholder="Versión en inglés"
                                error={errors["video.title.en"]}
                                optional
                            />
                        </div>

                        <AdminTextInput
                            label="Enlace del video"
                            value={data.video.url}
                            onChange={(value) =>
                                setData("video", {
                                    ...data.video,
                                    url: value,
                                    video_file: null,
                                })
                            }
                            placeholder="Pegá acá el enlace de YouTube o Vimeo"
                            error={errors["video.url"]}
                            optional
                        />

                        <AdminFileField
                            label="Archivo de video"
                            value={data.video.video_file}
                            onChange={(file) =>
                                setData("video", {
                                    ...data.video,
                                    video_file: file,
                                    url: "",
                                })
                            }
                            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                            maxSizeMB={50}
                            currentUrl={data.video.existing_video ? `/storage/${data.video.existing_video}` : null}
                            currentLabel="Video actual cargado en la sección"
                            hint="Si elegís un archivo nuevo, reemplaza al actual al guardar."
                            error={errors["video.video_file"]}
                            kind="video"
                            optional
                            buttonLabel="Seleccionar video"
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
