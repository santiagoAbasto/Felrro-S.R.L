import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function Edit({ position }) {
    const { data, setData, put, processing, errors } = useForm({
        title: position.title ?? { es: "", en: "" },
        is_active: position.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.hr.positions.update", position.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar puesto laboral" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Editar puesto laboral"
                    description="Actualizá el nombre visible del puesto y definí si sigue disponible para nuevas postulaciones."
                    actions={
                        <Link
                            href={route("admin.hr.positions.index")}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Volver al listado
                        </Link>
                    }
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Datos del puesto"
                        description="Mantené nombres consistentes con las áreas internas y las búsquedas del equipo."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Título"
                                value={data.title.es}
                                onChange={(value) => setData("title", { ...data.title, es: value })}
                                error={errors["title.es"]}
                            />
                            <AdminTextInput
                                label="Título en inglés"
                                value={data.title.en}
                                onChange={(value) => setData("title", { ...data.title, en: value })}
                                error={errors["title.en"]}
                                optional
                            />
                        </div>

                        <AdminToggle
                            label="Puesto activo"
                            hint="Si lo pausás, deja de ofrecerse como opción en el formulario público."
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
