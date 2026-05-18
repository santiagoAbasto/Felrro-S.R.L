import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    panelInputClass,
} from "@/Components/Admin/FormElements";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";
import { useMemo, useState } from "react";

const getText = (value, fallback = "-") => {
    if (!value) {
        return fallback;
    }

    if (typeof value === "string") {
        return value;
    }

    return value.es || value.en || fallback;
};

export default function Index({
    icons = [],
    categories = [],
    batches = [],
    products = [],
}) {
    const { flash = {} } = usePage().props;
    const [deletingBatchId, setDeletingBatchId] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: categories[0]?.id ? String(categories[0].id) : "",
        technical_excel: null,
        cover_excel: null,
        pdf_color_table: null,
        icon_ids: [],
    });

    const selectedCategory = useMemo(
        () => categories.find((category) => String(category.id) === String(data.category_id)),
        [categories, data.category_id]
    );

    const toggleIcon = (id) => {
        const stringId = String(id);

        setData(
            "icon_ids",
            data.icon_ids.includes(stringId)
                ? data.icon_ids.filter((current) => current !== stringId)
                : [...data.icon_ids, stringId]
        );
    };

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.products.import.aflamex-potencia.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset("technical_excel", "cover_excel", "pdf_color_table"),
        });
    };

    const destroyBatch = (batch) => {
        if (!confirm("¿Querés limpiar esta importación? Los productos generados se van a ocultar de la vista pública.")) {
            return;
        }

        setDeletingBatchId(batch.id);
        router.delete(route("admin.products.import.aflamex-potencia.destroy", batch.id), {
            preserveScroll: true,
            onFinish: () => setDeletingBatchId(null),
        });
    };

    const destroyLatest = () => {
        if (!confirm("¿Querés limpiar la última importación procesada?")) {
            return;
        }

        setDeletingBatchId("latest");
        router.delete(route("admin.products.import.aflamex-potencia.destroy-latest"), {
            preserveScroll: true,
            onFinish: () => setDeletingBatchId(null),
        });
    };

    return (
        <AdminLayout>
            <Head title="Importación técnica" />
            <Toast message={flash.success} type="success" />
            <Toast message={flash.error} type="error" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Importador técnico"
                    description="Procesá planillas técnicas, elegí la categoría de destino y generá productos con sus fichas PDF desde un mismo flujo."
                    actions={
                        <button
                            type="button"
                            onClick={destroyLatest}
                            disabled={deletingBatchId === "latest"}
                            className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                        >
                            <Icon icon="solar:trash-bin-trash-outline" width={16} />
                            {deletingBatchId === "latest" ? "Limpiando..." : "Limpiar última importación"}
                        </button>
                    }
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        title="Categorías activas"
                        value={categories.length}
                        icon="solar:layers-outline"
                    />
                    <StatCard
                        title="Iconos técnicos"
                        value={icons.length}
                        icon="solar:gallery-favourite-outline"
                    />
                    <StatCard
                        title="Productos técnicos"
                        value={products.length}
                        icon="solar:box-minimalistic-outline"
                    />
                </div>

                <AdminSectionCard
                    title="Nueva importación"
                    description="La planilla técnica es obligatoria. La planilla de portada y la tabla de color para PDF son opcionales."
                >
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                                        Categoría de destino
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(event) => setData("category_id", event.target.value)}
                                        className={panelInputClass}
                                    >
                                        <option value="">Seleccioná una categoría</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {getText(category.name)}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedCategory ? (
                                        <p className="mt-2 text-xs text-slate-400">
                                            Los productos importados se publicarán dentro de {getText(selectedCategory.name)}.
                                        </p>
                                    ) : null}
                                    {errors.category_id ? (
                                        <p className="mt-2 text-xs font-medium text-red-500">{errors.category_id}</p>
                                    ) : null}
                                </div>

                                <AdminFileField
                                    label="Planilla técnica"
                                    value={data.technical_excel}
                                    onChange={(file) => setData("technical_excel", file)}
                                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    error={errors.technical_excel}
                                    hint="Usá la planilla técnica original en formato .xlsx."
                                    maxSizeMB={10}
                                    kind="document"
                                    buttonLabel="Seleccionar planilla técnica"
                                />

                                <AdminFileField
                                    label="Planilla de portada"
                                    value={data.cover_excel}
                                    onChange={(file) => setData("cover_excel", file)}
                                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    error={errors.cover_excel}
                                    hint="Opcional. Se usa para completar datos comerciales o de portada si la importación lo requiere."
                                    optional
                                    maxSizeMB={10}
                                    kind="document"
                                    buttonLabel="Seleccionar planilla de portada"
                                />

                                <AdminFileField
                                    label="Tabla de color para PDF"
                                    value={data.pdf_color_table}
                                    onChange={(file) => setData("pdf_color_table", file)}
                                    accept="image/png,image/jpeg,image/webp"
                                    error={errors.pdf_color_table}
                                    hint="Opcional. Imagen que se adjunta a la ficha PDF generada."
                                    optional
                                    maxSizeMB={5}
                                    kind="image"
                                    buttonLabel="Seleccionar imagen"
                                />
                            </div>

                            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-sm font-semibold text-slate-800">
                                    Iconos para asociar
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                    Se aplican a los productos generados en esta tanda.
                                </p>

                                <div className="mt-4 max-h-[520px] space-y-2 overflow-auto pr-1">
                                    {icons.length ? icons.map((icon) => {
                                        const id = String(icon.id);
                                        const checked = data.icon_ids.includes(id);

                                        return (
                                            <button
                                                key={icon.id}
                                                type="button"
                                                onClick={() => toggleIcon(id)}
                                                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                                                    checked
                                                        ? "border-[#25A7CA]/40 bg-[#25A7CA]/10"
                                                        : "border-slate-200 bg-white hover:border-[#25A7CA]/25"
                                                }`}
                                            >
                                                <span
                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                        checked
                                                            ? "border-[#25A7CA] bg-[#25A7CA] text-white"
                                                            : "border-slate-300 bg-white"
                                                    }`}
                                                >
                                                    {checked ? <Icon icon="solar:check-read-outline" width={13} /> : null}
                                                </span>
                                                {icon.image_url ? (
                                                    <img
                                                        src={icon.image_url}
                                                        alt=""
                                                        className="h-8 w-8 rounded-lg object-contain"
                                                    />
                                                ) : (
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                                        <Icon icon="solar:gallery-outline" width={16} />
                                                    </span>
                                                )}
                                                <span className="min-w-0 text-sm font-medium text-slate-700">
                                                    {getText(icon.name, icon.slug)}
                                                </span>
                                            </button>
                                        );
                                    }) : (
                                        <p className="rounded-2xl border border-slate-200 bg-white px-3 py-4 text-sm text-slate-400">
                                            No hay iconos activos cargados.
                                        </p>
                                    )}
                                </div>
                                {errors.icon_ids ? (
                                    <p className="mt-2 text-xs font-medium text-red-500">{errors.icon_ids}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-relaxed text-slate-400">
                                Al importar, se crean productos, se generan secciones técnicas y se dejan listos los archivos de ficha cuando corresponde.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25A7CA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <Icon icon="svg-spinners:ring-resize" width={16} />
                                        Importando...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="solar:upload-square-outline" width={17} />
                                        Importar productos
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </AdminSectionCard>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <AdminSectionCard
                        title="Productos generados recientemente"
                        description="Últimos productos con secciones técnicas creadas por importaciones."
                    >
                        <div className="overflow-hidden rounded-[24px] border border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Producto</th>
                                        <th className="px-4 py-3">Categoría</th>
                                        <th className="px-4 py-3">Secciones</th>
                                        <th className="px-4 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {products.length ? products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-slate-700">
                                                    {getText(product.name)}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {product.slug}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">
                                                {getText(product.category?.name, "Sin categoría")}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                    {product.technical_sections_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href={route("admin.products.edit", product.id)}
                                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                                Todavía no hay productos técnicos importados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Últimas importaciones"
                        description="Podés limpiar una tanda para ocultar los productos creados por esa importación."
                    >
                        <div className="space-y-3">
                            {batches.length ? batches.map((batch) => {
                                const summaryCount = Array.isArray(batch.summary) ? batch.summary.length : 0;
                                const isDeleting = deletingBatchId === batch.id;

                                return (
                                    <article
                                        key={batch.id}
                                        className="rounded-[24px] border border-slate-200 bg-white p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Importación #{batch.id}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {summaryCount} producto{summaryCount === 1 ? "" : "s"} procesado{summaryCount === 1 ? "" : "s"}
                                                </p>
                                            </div>
                                            <StatusBadge status={batch.status} />
                                        </div>

                                        {Array.isArray(batch.errors) && batch.errors.length ? (
                                            <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700">
                                                {batch.errors.slice(0, 2).join(" ")}
                                            </div>
                                        ) : null}

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <span className="text-xs text-slate-400">
                                                {batch.created_at ? new Date(batch.created_at).toLocaleString("es-AR") : ""}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => destroyBatch(batch)}
                                                disabled={isDeleting || batch.status === "cleaned"}
                                                className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isDeleting ? "Limpiando..." : "Limpiar"}
                                            </button>
                                        </div>
                                    </article>
                                );
                            }) : (
                                <p className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                                    No hay importaciones registradas todavía.
                                </p>
                            )}
                        </div>
                    </AdminSectionCard>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {title}
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#25A7CA]/10 text-[#117a98]">
                    <Icon icon={icon} width={18} />
                </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const className = {
        processed: "bg-emerald-100 text-emerald-700",
        cleaned: "bg-slate-200 text-slate-500",
        failed: "bg-red-100 text-red-600",
    }[status] || "bg-amber-100 text-amber-700";

    const label = {
        processed: "Procesada",
        cleaned: "Limpiada",
        failed: "Con errores",
    }[status] || status || "Pendiente";

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
            {label}
        </span>
    );
}
