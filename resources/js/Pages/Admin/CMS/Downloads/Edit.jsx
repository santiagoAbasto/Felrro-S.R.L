import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function Edit({ download }) {
    const { data, setData, put, processing, errors } = useForm({
        name: download.name ?? { es: "", en: "" },
        file: null,
        order: download.order ?? "",
        is_active: download.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.downloads.update", download.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar descarga" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Descargas"
                    title="Editar descarga"
                    description="Podés actualizar el nombre, cambiar el archivo o ajustar si debe seguir visible en la web."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard title="Información visible" description="Mantené el nombre claro para que el visitante sepa qué está descargando.">
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

                    <AdminSectionCard title="Archivo" description="Si no elegís uno nuevo, se conserva el archivo actual.">
                        <AdminFileField
                            label="Documento"
                            value={data.file}
                            onChange={(file) => setData("file", file)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg,.webp"
                            maxSizeMB={20}
                            currentUrl={download.file_url}
                            currentLabel={`${download.format} • ${download.weight}`}
                            hint="Podés abrir el archivo actual para confirmar que sea el correcto."
                            error={errors.file}
                            kind="document"
                            buttonLabel="Reemplazar archivo"
                        />
                    </AdminSectionCard>

                    <AdminSectionCard title="Orden y visibilidad" description="Usá el orden para acomodar el listado y definí si debe seguir mostrándose.">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Orden"
                                value={data.order}
                                onChange={(value) => setData("order", value.toUpperCase())}
                                placeholder="Ej: A, AA o AB"
                                hint="Referencia corta para ordenar."
                                error={errors.order}
                                optional
                            />
                            <AdminToggle
                                label="Mostrar esta descarga en la web"
                                hint="Si la desactivás, queda guardada pero no se muestra."
                                checked={data.is_active}
                                onChange={(value) => setData("is_active", value)}
                            />
                        </div>
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Actualizando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
