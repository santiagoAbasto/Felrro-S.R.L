import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Edit({ section }) {

    const [preview, setPreview] = useState(
        section?.image ? `/storage/${section.image}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        title: section?.title ?? { es: "", en: "" },
        subtitle: section?.subtitle ?? { es: "", en: "" },
        content: section?.content ?? { es: "", en: "" },
        image: null,
        is_active: section?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.cms.calidad.update"), {
            forceFormData: true
        });
    };

    const handleImage = (file) => {
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout>
            <Head title="Editar Calidad" />

            <div className="p-10 bg-gray-50 min-h-screen">

                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Editar Sección Calidad
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Gestiona contenido multilenguaje y configuración visual.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-10">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-10">

                        {/* ================= TITULOS ================= */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Títulos
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Título (ES)
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-2 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        value={data.title.es}
                                        onChange={(e)=>setData("title",{...data.title, es:e.target.value})}
                                    />
                                    {errors["title.es"] && (
                                        <p className="text-red-500 text-sm mt-1">{errors["title.es"]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Título (EN)
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-2 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        value={data.title.en}
                                        onChange={(e)=>setData("title",{...data.title, en:e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= INTRO ================= */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Introducción
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Intro (ES)
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="mt-2 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        value={data.subtitle.es}
                                        onChange={(e)=>setData("subtitle",{...data.subtitle, es:e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Intro (EN)
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="mt-2 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        value={data.subtitle.en}
                                        onChange={(e)=>setData("subtitle",{...data.subtitle, en:e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= POLITICAS ================= */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Políticas / Lista
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Políticas (ES)
                                    </label>
                                    <textarea
                                        rows="8"
                                        className="mt-2 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        value={data.content.es}
                                        onChange={(e)=>setData("content",{...data.content, es:e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Policies (EN)
                                    </label>
                                    <textarea
                                        rows="8"
                                        className="mt-2 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        value={data.content.en}
                                        onChange={(e)=>setData("content",{...data.content, en:e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= IMAGEN ================= */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Imagen lateral
                            </h2>

                            <div className="flex items-center gap-8">
                                {preview && (
                                    <img
                                        src={preview}
                                        className="w-44 h-44 object-cover rounded-xl border"
                                    />
                                )}

                                <div>
                                    <input
                                        type="file"
                                        onChange={(e)=>handleImage(e.target.files[0])}
                                        className="text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Máximo 5MB • JPG, PNG o WEBP
                                    </p>
                                </div>
                            </div>

                            {errors.image && (
                                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                            )}
                        </div>

                        {/* ================= TOGGLE ================= */}
                        <div className="flex items-center gap-3 pt-6 border-t">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e)=>setData("is_active", e.target.checked)}
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Sección activa
                            </span>
                        </div>

                    </div>

                    {/* BOTON GUARDAR */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
                        >
                            <Icon icon="solar:diskette-outline" width={18} />
                            Guardar cambios
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}