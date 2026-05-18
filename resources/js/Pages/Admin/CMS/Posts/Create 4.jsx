import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        category: { es: "", en: "" },
        title: { es: "", en: "" },
        excerpt: { es: "", en: "" },
        content: { es: "", en: "" },
        image: null,
        order: "",
        is_featured: false,
        is_active: true,
        published_at: ""
    });

    const [preview, setPreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.posts.store"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Nueva Novedad" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Nueva Novedad
                </h1>

                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">

                    <form onSubmit={submit} className="space-y-10">

                        {/* ================= CATEGORY ================= */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block font-semibold mb-2">
                                    Categoría (ES)
                                </label>
                                <input
                                    value={data.category.es}
                                    onChange={(e) =>
                                        setData("category", {
                                            ...data.category,
                                            es: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Categoría (EN)
                                </label>
                                <input
                                    value={data.category.en}
                                    onChange={(e) =>
                                        setData("category", {
                                            ...data.category,
                                            en: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3"
                                />
                            </div>
                        </div>

                        {/* ================= TITULO ================= */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block font-semibold mb-2">
                                    Título (ES)
                                </label>
                                <input
                                    value={data.title.es}
                                    onChange={(e) =>
                                        setData("title", {
                                            ...data.title,
                                            es: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Título (EN)
                                </label>
                                <input
                                    value={data.title.en}
                                    onChange={(e) =>
                                        setData("title", {
                                            ...data.title,
                                            en: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3"
                                />
                            </div>
                        </div>

                        {/* ================= EXCERPT ================= */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block font-semibold mb-2">
                                    Extracto (ES)
                                </label>
                                <textarea
                                    value={data.excerpt.es}
                                    onChange={(e) =>
                                        setData("excerpt", {
                                            ...data.excerpt,
                                            es: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 h-24"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Extracto (EN)
                                </label>
                                <textarea
                                    value={data.excerpt.en}
                                    onChange={(e) =>
                                        setData("excerpt", {
                                            ...data.excerpt,
                                            en: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 h-24"
                                />
                            </div>
                        </div>

                        {/* ================= CONTENIDO ================= */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block font-semibold mb-2">
                                    Contenido (ES)
                                </label>
                                <textarea
                                    value={data.content.es}
                                    onChange={(e) =>
                                        setData("content", {
                                            ...data.content,
                                            es: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 h-40"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Contenido (EN)
                                </label>
                                <textarea
                                    value={data.content.en}
                                    onChange={(e) =>
                                        setData("content", {
                                            ...data.content,
                                            en: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 h-40"
                                />
                            </div>
                        </div>

                        {/* ================= IMAGEN ================= */}
                        <div>
                            <label className="block font-semibold mb-3">
                                Imagen
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    setData("image", file);
                                    setPreview(URL.createObjectURL(file));
                                }}
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    className="mt-4 w-60 rounded-xl shadow border"
                                />
                            )}
                        </div>

                        {/* ================= ORDER ================= */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Orden (A, AA...)
                            </label>
                            <input
                                value={data.order}
                                onChange={(e) =>
                                    setData("order", e.target.value.toUpperCase())
                                }
                                className="w-full border rounded-xl px-4 py-3 uppercase"
                            />
                        </div>

                        {/* ================= SWITCHES ================= */}
                        <div className="flex gap-10">

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={() =>
                                        setData("is_featured", !data.is_featured)
                                    }
                                />
                                Destacado (Home)
                            </label>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={() =>
                                        setData("is_active", !data.is_active)
                                    }
                                />
                                Activo
                            </label>

                        </div>

                        {/* ================= FECHA ================= */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Fecha publicación
                            </label>
                            <input
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(e) =>
                                    setData("published_at", e.target.value)
                                }
                                className="w-full border rounded-xl px-4 py-3"
                            />
                        </div>

                        {/* ================= BOTON ================= */}
                        <button
                            disabled={processing}
                            className="bg-[#25A7CA] text-white px-8 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition"
                        >
                            Guardar Novedad
                        </button>

                    </form>

                </div>
            </div>
        </AdminLayout>
    );
}