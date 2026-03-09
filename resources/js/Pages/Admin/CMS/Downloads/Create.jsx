import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        file: null,
        order: "",
        is_active: true
    });

    const [fileName, setFileName] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.downloads.store"), {
            forceFormData: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Nueva Descarga" />

            <div className="p-10 bg-gray-50 min-h-screen space-y-8">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Nueva Descarga
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Agrega un nuevo archivo descargable al sitio web.
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

                        {/* ARCHIVO */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Archivo
                            </label>

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
                                            "Haz clic para subir un archivo (máx 20MB)"
                                        )}
                                    </div>

                                </label>
                            </div>

                            {errors.file && (
                                <p className="text-red-500 text-sm mt-2">
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
                                {processing ? "Guardando..." : "Guardar Descarga"}
                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}