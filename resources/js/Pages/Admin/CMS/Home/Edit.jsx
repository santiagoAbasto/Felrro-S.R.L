import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

/*
|--------------------------------------------------------------------------
| Helper para normalizar campos traducibles
|--------------------------------------------------------------------------
*/
const normalizeLang = (field) => ({
    es: field?.es ?? "",
    en: field?.en ?? "",
});

export default function Edit({ section }) {

    const { data, setData, put, processing } = useForm({
        id: section?.id ?? "",

        title: normalizeLang(section?.title),
        subtitle: normalizeLang(section?.subtitle),
        content: normalizeLang(section?.content),
        button_text: normalizeLang(section?.button_text),

        button_link: section?.button_link ?? "",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.cms.home.update"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar Nosotros - Home" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-10">

                <h1 className="text-3xl font-bold">
                    Gestión Nosotros (Home)
                </h1>

                <p className="text-gray-500 max-w-3xl">
                    Esta sección corresponde al bloque de vista previa que aparece dentro de la página pública de inicio. No edita la página completa de <strong>Nosotros</strong>, que se administra por separado.
                </p>

                <form onSubmit={submit} className="space-y-10">

                    {/* =====================================================
                        TEXTOS
                    ===================================================== */}
                    <div className="bg-white p-8 rounded-2xl shadow space-y-6">

                        <h2 className="text-xl font-semibold">
                            Textos
                        </h2>

                        {/* TITLE */}
                        <LangInput
                            label="Título (ES)"
                            value={data.title.es}
                            onChange={(val) =>
                                setData("title", { ...data.title, es: val })
                            }
                        />

                        <LangInput
                            label="Title (EN)"
                            value={data.title.en}
                            onChange={(val) =>
                                setData("title", { ...data.title, en: val })
                            }
                        />

                        {/* SUBTITLE */}
                        <LangInput
                            label="Subtítulo (ES)"
                            value={data.subtitle.es}
                            onChange={(val) =>
                                setData("subtitle", { ...data.subtitle, es: val })
                            }
                        />

                        <LangInput
                            label="Subtitle (EN)"
                            value={data.subtitle.en}
                            onChange={(val) =>
                                setData("subtitle", { ...data.subtitle, en: val })
                            }
                        />

                        {/* CONTENT */}
                        <LangTextarea
                            label="Contenido (ES)"
                            value={data.content.es}
                            onChange={(val) =>
                                setData("content", { ...data.content, es: val })
                            }
                        />

                        <LangTextarea
                            label="Content (EN)"
                            value={data.content.en}
                            onChange={(val) =>
                                setData("content", { ...data.content, en: val })
                            }
                        />

                        {/* BUTTON TEXT */}
                        <LangInput
                            label="Texto botón (ES)"
                            value={data.button_text.es}
                            onChange={(val) =>
                                setData("button_text", { ...data.button_text, es: val })
                            }
                        />

                        <LangInput
                            label="Button text (EN)"
                            value={data.button_text.en}
                            onChange={(val) =>
                                setData("button_text", { ...data.button_text, en: val })
                            }
                        />

                        {/* BUTTON LINK */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Link botón
                            </label>
                            <input
                                className="w-full border p-3 rounded"
                                value={data.button_link}
                                onChange={(e) =>
                                    setData("button_link", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* =====================================================
                        IMAGEN ACTUAL
                    ===================================================== */}
                    {section?.image && (
                        <div className="bg-white p-8 rounded-2xl shadow space-y-6">

                            <h2 className="text-xl font-semibold">
                                Imagen actual
                            </h2>

                            <img
                                src={`/storage/${section.image}`}
                                alt="Imagen actual"
                                className="w-64 rounded-xl border"
                            />
                        </div>
                    )}

                    {/* =====================================================
                        CAMBIAR IMAGEN
                    ===================================================== */}
                    <div className="bg-white p-8 rounded-2xl shadow space-y-4">

                        <h2 className="text-xl font-semibold">
                            Cambiar imagen
                        </h2>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) =>
                                setData("image", e.target.files[0])
                            }
                        />
                    </div>

                    {/* =====================================================
                        SUBMIT
                    ===================================================== */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {processing ? "Guardando..." : "Guardar Cambios"}
                    </button>

                </form>
            </div>
        </AdminLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Componentes reutilizables
|--------------------------------------------------------------------------
*/

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
                rows={4}
                className="w-full border p-3 rounded"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
