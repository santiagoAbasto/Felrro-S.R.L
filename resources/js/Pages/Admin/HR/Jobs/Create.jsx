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
        title: { es: "", en: "" },
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.hr.positions.store"));
    };

    return (
        <AdminLayout>
            <Head title="Nuevo puesto laboral" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="RRHH"
                    title="Nuevo puesto laboral"
                    description="Creá un puesto para que pueda seleccionarse desde el formulario público de postulaciones."
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
                        description="Usá nombres claros para que el postulante encuentre rápidamente la posición correcta."
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
                            hint="Si queda activo, ya podrá usarse en el formulario público."
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
                            {processing ? "Guardando..." : "Guardar puesto"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
