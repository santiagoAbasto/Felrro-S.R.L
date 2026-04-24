import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.hr.sectors.store"));
    };

    return (
        <AdminLayout>
            <Head title="Nuevo sector interno" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Nuevo sector interno"
                    description="Creá una nueva área interna para usarla en puestos y postulaciones."
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
                        description="Completá el nombre visible. La versión en inglés se puede dejar preparada para más adelante."
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
                            hint="Si queda activo, ya podrá usarse al crear puestos o revisar postulaciones."
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
                            {processing ? "Guardando..." : "Guardar sector"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
