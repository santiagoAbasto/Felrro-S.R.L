import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import SectorForm from "./SectorForm";

export default function Edit({ sector }) {

    const { data, setData, put, processing, errors } = useForm({
        name: sector.name ?? { es: "", en: "" },
        description: sector.description ?? { es: "", en: "" },
        order: sector.order ?? "",
        image: null, // 🔥 no enviar string existente
        is_active: sector.is_active ?? true
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.sectors.update", sector.id), {
            forceFormData: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>

            <Head title={`Editar Sector | ${sector.name?.es}`} />

            <div className="px-8 py-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Editar Sector
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Modifica la información del sector
                        </p>
                    </div>

                    <Link
                        href={route("admin.sectors.index")}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ← Volver
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                    <SectorForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        processing={processing}
                        errors={errors}
                        buttonText="Actualizar Sector"
                        currentImage={sector.image}
                    />

                </div>

            </div>

        </AdminLayout>
    );
}