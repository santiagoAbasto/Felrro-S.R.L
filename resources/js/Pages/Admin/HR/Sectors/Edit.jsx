import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function Edit({ sector }) {
    const { data, setData, put, processing, errors } = useForm({
        name: sector.name ?? { es: "", en: "" },
        is_active: sector.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.hr.sectors.update", sector.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar sector interno" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Editar sector interno"
                    description="Actualizá el nombre visible del sector y definí si debe seguir disponible dentro del panel."
                    actions={
                        <Link
                            href={route("admin.hr.sectors.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Volver al listado
                        </Link>
                    }
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Datos del sector"
                        description="Mantené nombres claros y fáciles de reconocer para el equipo."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Nombre"
                                value={data.name.es}
                                onChange={(value) => setData("name", { ...data.name, es: value })}
                                error={errors["name.es"]}
                            />
                            <AdminTextInput
                                label="Nombre en inglés"
                                value={data.name.en}
                                onChange={(value) => setData("name", { ...data.name, en: value })}
                                error={errors["name.en"]}
                                optional
                            />
                        </div>

                        <AdminToggle
                            label="Sector activo"
                            hint="Si lo pausás, deja de ofrecerse como opción dentro del panel."
                            checked={data.is_active}
                            onChange={(value) => setData("is_active", value)}
                        />
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
