import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import SectorForm from "./SectorForm";

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        description: { es: "", en: "" },
        image: null,
        is_active: true
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.sectors.store"), {
            forceFormData: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>

            <Head title="Crear Sector | Admin" />

            <div className="px-8 py-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Crear Sector
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Agrega un nuevo sector industrial
                        </p>
                    </div>

                    <Link
                        href={route("admin.sectors.index")}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ← Volver
                    </Link>
                </div>

                {/* FORM CARD */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                    <SectorForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        processing={processing}
                        errors={errors}
                        buttonText="Crear Sector"
                    />

                </div>

            </div>

        </AdminLayout>
    );
}