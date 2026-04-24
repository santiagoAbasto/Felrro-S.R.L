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
        });
    };

    return (
        <AdminLayout>
            <Head title="Nueva descarga" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Descargas"
                    title="Nueva descarga"
                    description="Cargá un archivo para que esté disponible en la web. Antes de guardar vas a poder revisar nombre, orden y archivo elegido."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Información visible"
                        description="Es el nombre que se mostrará en el sitio para que el visitante identifique el archivo."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Nombre"
                                value={data.name.es}
                                onChange={(value) => setData("name", { ...data.name, es: value })}
                                placeholder="Ej: Catálogo general"
                                error={errors["name.es"]}
                            />
                            <AdminTextInput
                                label="Nombre en inglés"
                                value={data.name.en}
                                onChange={(value) => setData("name", { ...data.name, en: value })}
                                placeholder="Versión en inglés"
                                error={errors["name.en"]}
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Archivo"
                        description="Elegí el documento final para publicar. El panel muestra el nombre del archivo seleccionado."
                        tone="accent"
                    >
                        <AdminFileField
                            label="Documento"
                            value={data.file}
                            onChange={(file) => setData("file", file)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg,.webp"
                            maxSizeMB={20}
                            hint="Podés subir documentos, planillas, archivos comprimidos o imágenes según lo que necesites compartir."
                            error={errors.file}
                            kind="document"
                            buttonLabel="Elegir archivo"
                        />
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Orden y visibilidad"
                        description="El orden ayuda a decidir cómo se muestra dentro del listado."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Orden"
                                value={data.order}
                                onChange={(value) => setData("order", value.toUpperCase())}
                                placeholder="Ej: A, AA o AB"
                                hint="Usá una referencia corta para ordenar el listado."
                                error={errors.order}
                                optional
                            />

                            <AdminToggle
                                label="Mostrar esta descarga en la web"
                                hint="Si queda desactivada, se guarda pero no se muestra."
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
                            {processing ? "Guardando..." : "Guardar descarga"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
