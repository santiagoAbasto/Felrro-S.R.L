import { AdminTextInput, AdminToggle } from "@/Components/Admin/FormElements";

export default function Form({ data, setData, errors = {}, processing, submit, buttonText }) {
    return (
        <form onSubmit={submit} className="space-y-6">
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
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <AdminTextInput
                    label="Orden"
                    value={data.order}
                    onChange={(value) => setData("order", value)}
                    error={errors.order}
                />
                <AdminTextInput
                    label="Formato"
                    value={data.format}
                    onChange={(value) => setData("format", value)}
                    error={errors.format}
                    optional
                />
                <AdminTextInput
                    label="Peso"
                    value={data.weight}
                    onChange={(value) => setData("weight", value)}
                    error={errors.weight}
                    optional
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <FileField
                    label="Archivo del certificado"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                    onChange={(file) => setData("file", file)}
                    error={errors.file}
                />
                <FileField
                    label="Logo o imagen"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(file) => setData("image_logo", file)}
                    error={errors.image_logo}
                />
            </div>

            <AdminToggle
                label="Mostrar certificado"
                hint="Si está activo, se publicará en la sección Calidad."
                checked={data.is_active}
                onChange={(value) => setData("is_active", value)}
            />

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                >
                    {processing ? "Guardando..." : buttonText}
                </button>
            </div>
        </form>
    );
}

function FileField({ label, accept, onChange, error }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
            <input
                type="file"
                accept={accept}
                onChange={(event) => onChange(event.target.files[0])}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
            />
            {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
        </label>
    );
}
