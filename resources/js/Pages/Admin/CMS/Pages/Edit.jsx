import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Edit({ page }) {

    const { data, setData, put, processing, errors } = useForm({
        title: page.title ?? { es: "", en: "" },
        meta_title: page.meta_title ?? { es: "", en: "" },
        meta_description: page.meta_description ?? { es: "", en: "" },
        is_active: page.is_active ?? true
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.pages.update", page.id));
    };

    return (
        <AdminLayout>
            <Head title={`Editar Página - ${page.slug}`} />

            <div className="p-10 bg-gray-50 min-h-screen">

                <div className="max-w-5xl space-y-10">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Editar Página
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Slug: {page.slug}
                        </p>
                    </div>

                    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">

                        <SectionTitle label="Título" />

                        <LangInput
                            label="Título Español"
                            value={data.title.es}
                            onChange={(val) =>
                                setData("title", { ...data.title, es: val })
                            }
                            error={errors["title.es"]}
                        />

                        <LangInput
                            label="Title English"
                            value={data.title.en}
                            onChange={(val) =>
                                setData("title", { ...data.title, en: val })
                            }
                            error={errors["title.en"]}
                        />

                        <SectionTitle label="Meta Title (SEO)" />

                        <LangInput
                            label="Meta Title ES"
                            value={data.meta_title.es}
                            onChange={(val) =>
                                setData("meta_title", { ...data.meta_title, es: val })
                            }
                        />

                        <LangInput
                            label="Meta Title EN"
                            value={data.meta_title.en}
                            onChange={(val) =>
                                setData("meta_title", { ...data.meta_title, en: val })
                            }
                        />

                        <SectionTitle label="Meta Description (SEO)" />

                        <LangTextarea
                            label="Meta Description ES"
                            value={data.meta_description.es}
                            onChange={(val) =>
                                setData("meta_description", { ...data.meta_description, es: val })
                            }
                        />

                        <LangTextarea
                            label="Meta Description EN"
                            value={data.meta_description.en}
                            onChange={(val) =>
                                setData("meta_description", { ...data.meta_description, en: val })
                            }
                        />

                        {/* ESTADO */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <div>
                                <div className="font-semibold text-gray-800">
                                    Página Activa
                                </div>
                                <div className="text-sm text-gray-500">
                                    Si está desactivada no será visible públicamente.
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setData("is_active", !data.is_active)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                                    data.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {data.is_active ? "Activa" : "Inactiva"}
                            </button>
                        </div>

                        {/* BOTÓN */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                            >
                                {processing ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>

                    {/* =========================
                        SECCIONES ASOCIADAS
                    ========================= */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Secciones de esta página
                        </h2>

                        {page.sections?.length > 0 ? (
                            page.sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="flex justify-between items-center border p-4 rounded-lg"
                                >
                                    <div>
                                        <div className="font-medium capitalize">
                                            {section.type}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {section.is_active ? "Activa" : "Inactiva"} | Orden: {section.order}
                                        </div>
                                    </div>

                                    <Link
                                        href={route("admin.sections.edit", section.id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Editar Sección
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400">
                                Esta página aún no tiene secciones asociadas.
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}


/* =========================
   COMPONENTES INTERNOS
========================= */

function SectionTitle({ label }) {
    return (
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {label}
        </h2>
    );
}

function LangInput({ label, value, onChange, error }) {
    return (
        <div>
            <label className="block font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
        </div>
    );
}

function LangTextarea({ label, value, onChange }) {
    return (
        <div>
            <label className="block font-medium text-gray-700 mb-2">
                {label}
            </label>
            <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}