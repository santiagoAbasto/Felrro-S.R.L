import { useEffect, useState } from "react";

export default function CategoryForm({
    data,
    setData,
    submit,
    processing,
    errors,
    buttonText,
    preview = null,
    onDeleteImage = null,
}) {

    const [localPreview, setLocalPreview] = useState(null);

    /* =====================================================
       SINCRONIZAR PREVIEW
    ===================================================== */
    useEffect(() => {
        setLocalPreview(preview);
    }, [preview]);

    /* =====================================================
       CUANDO SE SUBE NUEVA IMAGEN
    ===================================================== */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData("image", file);
        setData("delete_image", false);

        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);
    };

    /* =====================================================
       ELIMINAR IMAGEN
    ===================================================== */
    const handleRemoveImage = () => {
        if (onDeleteImage) {
            onDeleteImage();
        }
        setLocalPreview(null);
    };

    return (
        <div className="max-w-4xl">
            <form
                onSubmit={submit}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 space-y-10"
            >

                {/* =====================================================
                   BLOQUE PRINCIPAL
                ===================================================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <LangInput
                        label="Nombre (ES)"
                        value={data.name?.es}
                        onChange={(val) =>
                            setData("name", { ...data.name, es: val })
                        }
                        error={errors["name.es"]}
                    />

                    <LangInput
                        label="Name (EN)"
                        value={data.name?.en}
                        onChange={(val) =>
                            setData("name", { ...data.name, en: val })
                        }
                        error={errors["name.en"]}
                    />

                    <LangTextarea
                        label="Descripción (ES)"
                        value={data.description?.es}
                        onChange={(val) =>
                            setData("description", {
                                ...data.description,
                                es: val,
                            })
                        }
                    />

                    <LangTextarea
                        label="Description (EN)"
                        value={data.description?.en}
                        onChange={(val) =>
                            setData("description", {
                                ...data.description,
                                en: val,
                            })
                        }
                    />

                    <TextInput
                        label="Orden General (Opcional)"
                        value={data.order}
                        onChange={(val) =>
                            setData("order", val.toUpperCase())
                        }
                    />
                </div>

                {/* =====================================================
                   IMAGEN
                ===================================================== */}
                <div className="border-t pt-8 space-y-6">

                    <h3 className="text-lg font-semibold text-gray-900">
                        Imagen de Categoría
                    </h3>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-600
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-xl file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-indigo-50 file:text-indigo-700
                                   hover:file:bg-indigo-100"
                    />

                    {errors.image && (
                        <div className="text-rose-500 text-sm">
                            {errors.image}
                        </div>
                    )}

                    {localPreview && (
                        <div className="relative w-64 mt-4">
                            <img
                                src={localPreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-xl border shadow-sm"
                            />

                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs text-red-600 font-semibold shadow hover:bg-red-50 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>

                {/* =====================================================
                   CONFIGURACIÓN
                ===================================================== */}
                <div className="border-t pt-8 space-y-6">

                    <Toggle
                        label="Categoría Activa"
                        value={data.is_active}
                        onChange={() =>
                            setData("is_active", !data.is_active)
                        }
                    />

                    <Toggle
                        label="Mostrar en Home"
                        value={data.is_featured}
                        onChange={() =>
                            setData("is_featured", !data.is_featured)
                        }
                    />

                    {data.is_featured && (
                        <TextInput
                            label="Orden en Home"
                            value={data.featured_order}
                            onChange={(val) =>
                                setData("featured_order", val)
                            }
                        />
                    )}
                </div>

                {/* =====================================================
                   BOTÓN
                ===================================================== */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-sm transition font-semibold disabled:opacity-50"
                    >
                        {processing ? "Guardando..." : buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* =====================================================
   COMPONENTES AUXILIARES
===================================================== */

function LangInput({ label, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && (
                <div className="text-rose-500 text-xs mt-1">{error}</div>
            )}
        </div>
    );
}

function LangTextarea({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function TextInput({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
                {label}
            </span>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${value ? "bg-emerald-500" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}