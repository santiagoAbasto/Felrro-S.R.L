import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ sector }) {
    const { data, setData, put, processing, errors } = useForm({
        name: sector.name ?? { es: "", en: "" },
        is_active: sector.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.hr.sectors.update", sector.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar Sector" />
            <div className="p-8 min-h-screen bg-gray-50 font-[Montserrat]">

                {/* HEADER */}
                <div className="mb-8">
                    <Link
                        href={route("admin.hr.sectors.index")}
                        className="inline-flex items-center gap-2 text-[#25A7CA] text-sm font-medium no-underline hover:opacity-70 transition-opacity mb-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#25A7CA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Volver a Sectores
                    </Link>
                    <h1 className="text-3xl font-bold text-[#101010] leading-tight m-0">
                        Editar Sector
                    </h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-xl">
                    <div className="px-6 py-4 border-b border-[#DDDDE0]">
                        <h2 className="text-base font-bold text-[#101010] m-0">Datos del sector</h2>
                    </div>
                    <form onSubmit={submit} className="p-6 space-y-6">

                        {/* NOMBRE ES */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#101010]">Nombre (Español)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-[#D9D9D9] bg-white text-[#101010] text-sm outline-none focus:border-[#25A7CA] transition-colors"
                                value={data.name.es}
                                onChange={(e) => setData("name", { ...data.name, es: e.target.value })}
                                required
                            />
                            {errors["name.es"] && <span className="text-xs text-red-500">{errors["name.es"]}</span>}
                        </div>

                        {/* NOMBRE EN */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#101010]">Name (English)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-[#D9D9D9] bg-white text-[#101010] text-sm outline-none focus:border-[#25A7CA] transition-colors"
                                value={data.name.en}
                                onChange={(e) => setData("name", { ...data.name, en: e.target.value })}
                            />
                            {errors["name.en"] && <span className="text-xs text-red-500">{errors["name.en"]}</span>}
                        </div>

                        {/* TOGGLE ACTIVO */}
                        <div
                            className="flex items-center gap-3 cursor-pointer select-none"
                            onClick={() => setData("is_active", !data.is_active)}
                        >
                            <div className={"w-10 h-6 rounded-full transition-colors relative " + (data.is_active ? "bg-[#25A7CA]" : "bg-[#D9D9D9]")}>
                                <div className={"absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform " + (data.is_active ? "translate-x-5" : "translate-x-1")} />
                            </div>
                            <span className="text-sm font-medium text-[#101010]">
                                {data.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </div>

                        {/* SUBMIT */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex px-6 py-2.5 rounded-full bg-[#25A7CA] hover:bg-[#1f93b3] text-white text-sm font-semibold border-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Guardando..." : "Actualizar Sector"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
