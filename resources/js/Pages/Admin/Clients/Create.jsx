import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        logo: null,
        website: "",
        order: "A",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.clients.store"), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Crear Cliente" />
            <div className="space-y-8 max-w-2xl">

                <div className="flex items-center gap-4">
                    <Link href={route("admin.clients.index")} className="text-gray-400 hover:text-gray-600 transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Crear Cliente</h1>
                        <p className="text-gray-500 text-sm mt-1">Completá los datos del nuevo cliente.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="px-8 py-5 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Información</h2>
                    </div>

                    <div className="px-8 py-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre <span className="text-xs text-gray-400">(ES)</span></label>
                                <input type="text" value={data.name.es}
                                    onChange={e => setData("name", { ...data.name, es: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#25A7CA] focus:border-transparent outline-none transition"
                                    placeholder="Nombre en español" />
                                {errors["name.es"] && <p className="text-rose-500 text-xs mt-1">{errors["name.es"]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre <span className="text-xs text-gray-400">(EN)</span></label>
                                <input type="text" value={data.name.en}
                                    onChange={e => setData("name", { ...data.name, en: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#25A7CA] focus:border-transparent outline-none transition"
                                    placeholder="Name in English" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                            <input type="text" value={data.website}
                                onChange={e => setData("website", e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#25A7CA] focus:border-transparent outline-none transition"
                                placeholder="https://ejemplo.com" />
                        </div>

                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Orden <span className="text-xs text-gray-400">(A, AA, AB...)</span></label>
                            <input type="text" value={data.order}
                                onChange={e => setData("order", e.target.value.toUpperCase())}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm uppercase focus:ring-2 focus:ring-[#25A7CA] focus:border-transparent outline-none transition" />
                        </div>
                    </div>

                    <div className="px-8 py-5 border-t border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Logo</h2>
                    </div>

                    <div className="px-8 py-6">
                        <div className="flex items-start gap-6">
                            <div className="w-32 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 flex-shrink-0">
                                {preview ? (
                                    <img src={preview} className="max-h-16 max-w-28 object-contain" alt="Preview" />
                                ) : (
                                    <span className="text-xs text-gray-300 text-center px-2">Sin imagen</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subir logo</label>
                                <input type="file" accept="image/*"
                                    onChange={(e) => { setData("logo", e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}
                                    className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#25A7CA]/10 file:text-[#25A7CA] hover:file:bg-[#25A7CA]/20 cursor-pointer" />
                                <p className="text-xs text-gray-400 mt-1.5">PNG, JPG, SVG. Recomendado: fondo transparente.</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Cliente activo</p>
                            <p className="text-xs text-gray-400 mt-0.5">Visible en el sitio web</p>
                        </div>
                        <button type="button" onClick={() => setData("is_active", !data.is_active)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_active ? "bg-[#25A7CA]" : "bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.is_active ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>

                    <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <Link href={route("admin.clients.index")} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancelar</Link>
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-[#25A7CA] rounded-xl hover:bg-[#1f93b3] transition disabled:opacity-50 shadow-sm">
                            {processing ? "Guardando..." : "Guardar Cliente"}
                        </button>
                    </div>

                </div>
                </form>
            </div>
        </AdminLayout>
    );
}