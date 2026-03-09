import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState } from "react";

export default function Edit({ page }) {

    const main = page?.sections?.find(s => s.type === "about_main") || {};
    const metrics = page?.sections?.find(s => s.type === "about_metrics") || {};
    const valuesSection = page?.sections?.find(s => s.type === "about_values") || {};
    const video = page?.sections?.find(s => s.type === "about_video") || {};

    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const { data, setData, put, processing } = useForm({
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
        }
    });

    /* ================= IMAGE ================= */

    const handleImageChange = (file) => {
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
        setData("main", { ...data.main, image: file });
    };

    /* ================= VIDEO ================= */

    const handleVideoFileChange = (file) => {
        if (!file) return;
        setVideoPreview(URL.createObjectURL(file));
        setData("video", {
            ...data.video,
            video_file: file,
            url: ""
        });
    };

    const handleVideoUrlChange = (value) => {
        setVideoPreview(null);
        setData("video", {
            ...data.video,
            url: value,
            video_file: null
        });
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.about.update"), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Editar Página Nosotros" />

            <div className="p-10 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-16">

                    <h1 className="text-3xl font-bold">
                        Página Nosotros
                    </h1>

                    <form onSubmit={submit} className="space-y-16">

                        {/* ================= MAIN ================= */}
                        <Section title="Sección Principal">

                            <LangInput
                                label="Título ES"
                                value={data.main.title.es}
                                onChange={(val) =>
                                    setData("main", {
                                        ...data.main,
                                        title: { ...data.main.title, es: val }
                                    })
                                }
                            />

                            <LangInput
                                label="Title EN"
                                value={data.main.title.en}
                                onChange={(val) =>
                                    setData("main", {
                                        ...data.main,
                                        title: { ...data.main.title, en: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Contenido ES"
                                value={data.main.content.es}
                                onChange={(val) =>
                                    setData("main", {
                                        ...data.main,
                                        content: { ...data.main.content, es: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Content EN"
                                value={data.main.content.en}
                                onChange={(val) =>
                                    setData("main", {
                                        ...data.main,
                                        content: { ...data.main.content, en: val }
                                    })
                                }
                            />

                            <div>
                                <label className="font-medium">Imagen Principal</label>

                                {(imagePreview || data.main.existing_image) && (
                                    <img
                                        src={
                                            imagePreview
                                                ? imagePreview
                                                : `/storage/${data.main.existing_image}`
                                        }
                                        className="w-full max-w-md rounded-xl mt-4"
                                    />
                                )}

                                <input
                                    type="file"
                                    className="mt-4"
                                    onChange={(e) =>
                                        handleImageChange(e.target.files[0])
                                    }
                                />
                            </div>

                        </Section>

                        {/* ================= METRICS ================= */}
                        <Section title="Métricas">

                            {data.metrics.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4">

                                    <input
                                        className="border p-3 rounded"
                                        value={item.value}
                                        onChange={(e) => {
                                            const updated = [...data.metrics.items];
                                            updated[index].value = e.target.value;
                                            setData("metrics", {
                                                ...data.metrics,
                                                items: updated
                                            });
                                        }}
                                    />

                                    <input
                                        className="border p-3 rounded"
                                        value={item.label.es}
                                        onChange={(e) => {
                                            const updated = [...data.metrics.items];
                                            updated[index].label.es = e.target.value;
                                            setData("metrics", {
                                                ...data.metrics,
                                                items: updated
                                            });
                                        }}
                                    />

                                    <input
                                        className="border p-3 rounded"
                                        value={item.label.en}
                                        onChange={(e) => {
                                            const updated = [...data.metrics.items];
                                            updated[index].label.en = e.target.value;
                                            setData("metrics", {
                                                ...data.metrics,
                                                items: updated
                                            });
                                        }}
                                    />
                                </div>
                            ))}

                        </Section>

                        {/* ================= VALUES ================= */}
                        <Section title="Misión / Visión / Valores">

                            <LangTextarea
                                label="Misión ES"
                                value={data.values.mission.es}
                                onChange={(val) =>
                                    setData("values", {
                                        ...data.values,
                                        mission: { ...data.values.mission, es: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Mission EN"
                                value={data.values.mission.en}
                                onChange={(val) =>
                                    setData("values", {
                                        ...data.values,
                                        mission: { ...data.values.mission, en: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Visión ES"
                                value={data.values.vision.es}
                                onChange={(val) =>
                                    setData("values", {
                                        ...data.values,
                                        vision: { ...data.values.vision, es: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Vision EN"
                                value={data.values.vision.en}
                                onChange={(val) =>
                                    setData("values", {
                                        ...data.values,
                                        vision: { ...data.values.vision, en: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Valores ES"
                                value={data.values.values.es}
                                onChange={(val) =>
                                    setData("values", {
                                        ...data.values,
                                        values: { ...data.values.values, es: val }
                                    })
                                }
                            />

                            <LangTextarea
                                label="Values EN"
                                value={data.values.values.en}
                                onChange={(val) =>
                                    setData("values", {
                                        ...data.values,
                                        values: { ...data.values.values, en: val }
                                    })
                                }
                            />

                        </Section>

                        {/* ================= VIDEO ================= */}
                        <Section title="Video">

                            <input
                                type="text"
                                className="w-full border p-3 rounded"
                                placeholder="URL YouTube"
                                value={data.video.url}
                                onChange={(e) =>
                                    handleVideoUrlChange(e.target.value)
                                }
                            />

                            {(videoPreview || data.video.existing_video) && (
                                <video
                                    src={
                                        videoPreview
                                            ? videoPreview
                                            : `/storage/${data.video.existing_video}`
                                    }
                                    controls
                                    className="w-full max-w-lg mt-4 rounded"
                                />
                            )}

                            <input
                                type="file"
                                className="mt-4"
                                onChange={(e) =>
                                    handleVideoFileChange(e.target.files[0])
                                }
                            />

                        </Section>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl"
                        >
                            Guardar Cambios
                        </button>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
    return (
        <div className="bg-white p-10 rounded-2xl shadow space-y-6">
            <h2 className="text-xl font-semibold border-b pb-3">{title}</h2>
            {children}
        </div>
    );
}

function LangInput({ label, value, onChange }) {
    return (
        <div>
            <label className="block mb-2 font-medium">{label}</label>
            <input
                className="w-full border p-3 rounded"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function LangTextarea({ label, value, onChange }) {
    return (
        <div>
            <label className="block mb-2 font-medium">{label}</label>
            <textarea
                rows={5}
                className="w-full border p-3 rounded"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}