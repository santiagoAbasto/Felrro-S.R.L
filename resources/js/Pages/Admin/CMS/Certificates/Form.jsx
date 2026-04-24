import {
    AdminFileField,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function Form({
    data,
    setData,
    errors,
    processing,
    submit,
    existingFile = null,
    existingLogo = null,
    buttonText = "Guardar",
}) {
    return (
        <form onSubmit={submit} className="space-y-8">
            <AdminSectionCard
                title="Información del certificado"
                description="Completá un nombre claro y un orden simple para ubicarlo dentro del listado."
            >
                <div className="grid gap-6 lg:grid-cols-2">
                    <AdminTextInput
                        label="Nombre"
                        value={data.name.es}
                        onChange={(value) => setData("name", { ...data.name, es: value })}
                        placeholder="Ej: Certificación ISO 9001"
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

                <div className="grid gap-6 lg:grid-cols-2">
                    <AdminTextInput
                        label="Orden"
                        value={data.order}
                        onChange={(value) => setData("order", value.toUpperCase())}
                        placeholder="Ej: A, AA o AB"
                        hint="Se usa para acomodar los certificados en el listado."
                        error={errors.order}
                    />
                    <AdminToggle
                        label="Mostrar certificado en la web"
                        hint="Si lo desactivás, queda guardado pero no se muestra."
                        checked={data.is_active}
                        onChange={(value) => setData("is_active", value)}
                    />
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Archivo del certificado"
                description="Subí el documento oficial. El sistema te muestra el archivo actual si ya había uno cargado."
                tone="accent"
            >
                <AdminFileField
                    label="Documento"
                    value={data.file}
                    onChange={(file) => {
                        setData("file", file);
                        if (file) {
                            const sizeKB = Math.round(file.size / 1024);
                            setData("format", file.type.includes("pdf") ? "PDF" : file.name.split(".").pop()?.toUpperCase() || "");
                            setData("weight", `${sizeKB} KB`);
                        }
                    }}
                    accept="application/pdf"
                    maxSizeMB={15}
                    currentUrl={existingFile ? `/storage/${existingFile}` : null}
                    currentLabel={existingFile ? "Documento actual cargado" : null}
                    hint="Actualmente se admite PDF. El tamaño máximo es 15 MB."
                    error={errors.file}
                    kind="document"
                    buttonLabel="Seleccionar PDF"
                />
            </AdminSectionCard>

            <AdminSectionCard
                title="Logo del certificado"
                description="Este logo acompaña al documento en la parte pública. Podés dejarlo vacío si no hace falta."
            >
                <AdminFileField
                    label="Logo"
                    value={data.image_logo}
                    onChange={(file) => setData("image_logo", file)}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    maxSizeMB={15}
                    currentUrl={existingLogo}
                    currentLabel={existingLogo ? "Logo actual cargado" : null}
                    hint="Conviene usar una imagen limpia, preferentemente con fondo transparente."
                    error={errors.image_logo}
                    optional
                />
            </AdminSectionCard>

            <AdminSectionCard
                title="Datos de referencia"
                description="Estos datos se completan de forma automática al elegir el archivo, pero podés ajustarlos si lo necesitás."
            >
                <div className="grid gap-6 lg:grid-cols-2">
                    <AdminTextInput
                        label="Formato"
                        value={data.format || ""}
                        onChange={(value) => setData("format", value)}
                        placeholder="PDF"
                        error={errors.format}
                        optional
                    />
                    <AdminTextInput
                        label="Peso"
                        value={data.weight || ""}
                        onChange={(value) => setData("weight", value)}
                        placeholder="Ej: 850 KB"
                        error={errors.weight}
                        optional
                    />
                </div>
            </AdminSectionCard>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                >
                    {processing ? "Guardando..." : buttonText}
                </button>
            </div>
        </form>
    );
}
