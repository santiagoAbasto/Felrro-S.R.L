import AdminLayout from "@/Layouts/AdminLayout";
import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: { es: "", en: "" },
        file: null,
        order: "",
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.downloads.store"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Nueva descarga" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Descargas"
                    title="Nueva descarga"
                    description="Subí un archivo descargable y definí cómo se mostrará en la sección pública."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard title="Información visible">
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
                    </AdminSectionCard>

                    <AdminSectionCard title="Archivo">
                        <AdminFileField
                            label="Documento"
                            value={data.file}
                            onChange={(file) => setData("file", file)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg,.webp"
                            maxSizeMB={20}
                            error={errors.file}
                            kind="document"
                            buttonLabel="Seleccionar archivo"
                        />
                    </AdminSectionCard>

                    <AdminSectionCard title="Orden y visibilidad">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Orden"
                                value={data.order}
                                onChange={(value) => setData("order", value.toUpperCase())}
                                placeholder="Ej: A"
                                error={errors.order}
                                optional
                            />
                            <AdminToggle
                                label="Mostrar esta descarga en la web"
                                checked={data.is_active}
                                onChange={(value) => setData("is_active", value)}
                            />
                        </div>
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Guardando..." : "Guardar descarga"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
