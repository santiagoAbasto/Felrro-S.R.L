import { useEffect, useState } from "react";

export default function SectorForm({
    data,
    setData,
    submit,
    processing,
    errors,
    buttonText,
    currentImage = null
}) {

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (data.image instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(data.image);
        } else if (currentImage) {
            setPreview(`/storage/${currentImage}`);
        } else {
            setPreview(null);
        }
    }, [data.image, currentImage]);

    return (
        <form
            onSubmit={submit}
            className="space-y-10"
        >

            {/* ================= DATOS GENERALES ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* NOMBRE ES */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre (ES)
                    </label>
                    <input
                        type="text"
                        value={data.name.es}
                        onChange={(e) =>
                            setData("name", { ...data.name, es: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] focus:outline-none transition"
                    />
                    {errors["name.es"] && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors["name.es"]}
                        </p>
                    )}
                </div>

                {/* NOMBRE EN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre (EN)
                    </label>
                    <input
                        type="text"
                        value={data.name.en}
                        onChange={(e) =>
                            setData("name", { ...data.name, en: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] focus:outline-none transition"
                    />
                </div>

            </div>

            {/* ================= DESCRIPCIÓN ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción (ES)
                    </label>
                    <textarea
                        value={data.description.es}
                        onChange={(e) =>
                            setData("description", {
                                ...data.description,
                                es: e.target.value
                            })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-[#25A7CA] focus:outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción (EN)
                    </label>
                    <textarea
                        value={data.description.en}
                        onChange={(e) =>
                            setData("description", {
                                ...data.description,
                                en: e.target.value
                            })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-[#25A7CA] focus:outline-none transition"
                    />
                </div>

            </div>

            {/* ================= IMAGEN ================= */}
            <div className="space-y-4">

                <label className="block text-sm font-semibold text-gray-700">
                    Imagen del sector
                </label>

                {preview && (
                    <div className="relative w-72 h-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setData("image", e.target.files[0])}
                    className="block w-full text-sm text-gray-600
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-xl file:border-0
                               file:text-sm file:font-semibold
                               file:bg-[#25A7CA] file:text-white
                               hover:file:opacity-90 transition"
                />

                {errors.image && (
                    <p className="text-red-500 text-sm">
                        {errors.image}
                    </p>
                )}
            </div>

            <div>
                <label className="block font-semibold mb-2">
                    Orden
                </label>

                <input
                    type="text"
                    value={data.order}
                    onChange={e =>
                        setData("order", e.target.value.toUpperCase())
                    }
                    className="w-full border rounded-lg p-3 uppercase"
                    placeholder="Ej: A, AA, AB, BA..."
                />

                {errors.order && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.order}
                    </p>
                )}
            </div>
            {/* ================= ESTADO ================= */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData("is_active", e.target.checked)}
                    className="w-4 h-4 text-[#25A7CA] border-gray-300 rounded focus:ring-[#25A7CA]"
                />
                <span className="text-sm font-medium text-gray-700">
                    Sector activo
                </span>
            </div>

            {/* ================= BOTÓN ================= */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-[#25A7CA] text-white px-6 py-3 rounded-xl shadow hover:opacity-90 transition disabled:opacity-50"
                >
                    {buttonText}
                </button>
            </div>

        </form>
    );
}