import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({ download }) {

    const { data, setData, put, processing, errors } = useForm({
        name: download.name ?? { es: "", en: "" },
        file: null,
        order: download.order ?? "",
        is_active: download.is_active ?? true
    });

    const [fileName, setFileName] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.downloads.update", download.id), {
            forceFormData: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar Descarga" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Editar Descarga
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Actualiza la información o reemplaza el archivo.
                    </p>
                </div>

                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

                    <form onSubmit={submit} className="space-y-10">

                        {/* MULTILENGUAJE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre (Español)
                                </label>

                                <input
                                    type="text"
                                    value={data.name.es}
                                    onChange={(e) =>
                                        setData("name", { ...data.name, es: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] focus:border-[#25A7CA] outline-none transition"
                                />

                                {errors["name.es"] && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors["name.es"]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre (English)
                                </label>

                                <input
                                    type="text"
                                    value={data.name.en}
                                    onChange={(e) =>
                                        setData("name", { ...data.name, en: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] focus:border-[#25A7CA] outline-none transition"
                                />
                            </div>

                        </div>

                        {/* ARCHIVO ACTUAL */}
                        <div className="space-y-4">

                            <label className="block text-sm font-semibold text-gray-700">
                                Archivo actual
                            </label>

                            <div className="flex items-center justify-between bg-gray-50 border rounded-xl p-4">

                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {download.format} – {download.weight}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Archivo cargado actualmente
                                    </p>
                                </div>

                                <a
                                    href={download.file_url}
                                    target="_blank"
                                    className="text-[#25A7CA] text-sm font-semibold hover:underline"
                                >
                                    Ver archivo
                                </a>

                            </div>

                            {/* REEMPLAZAR */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#25A7CA] transition cursor-pointer bg-gray-50">

                                <input
                                    type="file"
                                    className="hidden"
                                    id="fileUpload"
                                    onChange={(e) => {
                                        setData("file", e.target.files[0]);
                                        setFileName(e.target.files[0]?.name);
                                    }}
                                />

                                <label htmlFor="fileUpload" className="cursor-pointer">

                                    <div className="text-gray-500">
                                        {fileName ? (
                                            <span className="font-semibold text-[#25A7CA]">
                                                {fileName}
                                            </span>
                                        ) : (
                                            "Haz clic para reemplazar el archivo"
                                        )}
                                    </div>

                                </label>
                            </div>

                            {errors.file && (
                                <p className="text-red-500 text-sm">
                                    {errors.file}
                                </p>
                            )}

                        </div>

                        {/* ORDEN + ACTIVO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Orden (A, AA, AB...)
                                </label>

                                <input
                                    type="text"
                                    value={data.order}
                                    onChange={(e) =>
                                        setData("order", e.target.value.toUpperCase())
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase focus:ring-2 focus:ring-[#25A7CA] focus:border-[#25A7CA] outline-none transition"
                                />
                            </div>

                            <div className="flex items-center gap-4 mt-8 md:mt-0">
                                <label className="text-sm font-semibold text-gray-700">
                                    Activo
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setData("is_active", !data.is_active)
                                    }
                                    className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
                                        data.is_active
                                            ? "bg-[#25A7CA]"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <div
                                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                                            data.is_active
                                                ? "translate-x-6"
                                                : ""
                                        }`}
                                    />
                                </button>
                            </div>

                        </div>

                        {/* BOTÓN */}
                        <div className="flex justify-end pt-6 border-t border-gray-100">

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#25A7CA] text-white px-8 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition disabled:opacity-50"
                            >
                                {processing ? "Actualizando..." : "Actualizar Descarga"}
                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}