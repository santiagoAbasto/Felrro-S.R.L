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

const MAIN_GROUP_LIMIT = 10;
const OPTIONAL_GROUP_LIMIT = 10;
const FOOTER_GROUP_LIMIT = 10;
const ORDER_CODES = ["A", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ"];

export default function Index({
    icons = [],
    categories = [],
    batches = [],
    products = [],
}) {
    const { flash = {} } = usePage().props;
    const [deletingBatchId, setDeletingBatchId] = useState(null);
    const importIcons = useMemo(
        () => icons.filter((icon) => icon.placement !== "footer"),
        [icons]
    );
    const footerIcons = useMemo(
        () => icons.filter((icon) => icon.placement === "footer"),
        [icons]
    );
    const selectableIcons = useMemo(
        () => [...importIcons, ...footerIcons],
        [importIcons, footerIcons]
    );
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: categories[0]?.id ? String(categories[0].id) : "",
        technical_excel: null,
        cover_excel: null,
        pdf_color_table: null,
        icon_settings: [],
    });

    const selectedCategory = useMemo(
        () => categories.find((category) => String(category.id) === String(data.category_id)),
        [categories, data.category_id]
    );

    const iconSetting = (id) =>
        data.icon_settings.find((item) => String(item.id) === String(id));

    const groupCount = (group, nextSettings = data.icon_settings) =>
        nextSettings.filter((item) => item.pdf_group === group).length;

    const nextOrderForGroup = (group, settings = data.icon_settings) => {
        const used = settings
            .filter((item) => item.pdf_group === group)
            .map((item) => Number(item.order))
            .filter((order) => order > 0);

        const nextIndex = ORDER_CODES.findIndex((_, index) => !used.includes(index + 1));

        return nextIndex >= 0 ? nextIndex + 1 : 1;
    };

    const updateIconGroup = (id, group) => {
        const current = iconSetting(id);
        const withoutCurrent = data.icon_settings.filter((item) => String(item.id) !== String(id));

        if (current?.pdf_group === group) {
            setData("icon_settings", withoutCurrent);
            return;
        }

        const limit = group === "footer"
            ? FOOTER_GROUP_LIMIT
            : group === "optional"
                ? OPTIONAL_GROUP_LIMIT
                : MAIN_GROUP_LIMIT;

        if (groupCount(group, withoutCurrent) >= limit) {
            alert(`Solo se permiten ${limit} iconos en ${
                group === "footer"
                    ? "Pie de página"
                    : group === "optional"
                        ? "Opcionales"
                        : "Aplicaciones / constructividad"
            }.`);
            return;
        }

        const groupedByTitle = selectableIcons
            .map((icon) => {
                if (String(icon.id) === String(id)) {
                    return {
                        id: String(icon.id),
                        pdf_group: group,
                        order: current?.pdf_group === group ? current.order : nextOrderForGroup(group, withoutCurrent),
                    };
                }

                const existing = withoutCurrent.find((item) => String(item.id) === String(icon.id));

                return existing
                    ? { id: String(icon.id), pdf_group: existing.pdf_group, order: existing.order }
                    : null;
            })
            .filter(Boolean);

        setData("icon_settings", groupedByTitle);
    };

    const updateIconOrder = (id, order) => {
        setData(
            "icon_settings",
            data.icon_settings.map((item) =>
                String(item.id) === String(id) ? { ...item, order: Number(order) } : item
            )
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
                                    accept="image/png,image/jpeg,image/webp,application/pdf"
                                    error={errors.pdf_color_table}
                                    hint="Opcional. Podés subir imagen o PDF exportado desde Excel; si subís PDF se toma solo la primera página como imagen."
                                    optional
                                    maxSizeMB={10}
                                    kind="image"
                                    buttonLabel="Seleccionar imagen o PDF"
                                />
                            </div>

                            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-sm font-semibold text-slate-800">
                                    Iconos para asociar
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                    Se aplican a los productos generados en esta tanda. Elegí grupo y orden; cada grupo admite hasta 10 iconos.
                                </p>

                                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-semibold">
                                    <div className="rounded-2xl bg-white px-3 py-2 text-slate-500">
                                        Aplicaciones: {groupCount("main")}/{MAIN_GROUP_LIMIT}
                                    </div>
                                    <div className="rounded-2xl bg-white px-3 py-2 text-slate-500">
                                        Opcionales: {groupCount("optional")}/{OPTIONAL_GROUP_LIMIT}
                                    </div>
                                    <div className="rounded-2xl bg-white px-3 py-2 text-slate-500">
                                        Pie: {groupCount("footer")}/{FOOTER_GROUP_LIMIT}
                                    </div>
                                </div>

                                <div className="mt-4 max-h-[520px] space-y-2 overflow-auto pr-1">
                                    <p className="px-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Aplicaciones y opcionales
                                    </p>
                                    {importIcons.length ? importIcons.map((icon) => {
                                        const id = String(icon.id);
                                        const setting = iconSetting(id);

                                        return (
                                            <div
                                                key={icon.id}
                                                className={`rounded-2xl border px-3 py-3 transition ${
                                                    setting
                                                        ? "border-[#25A7CA]/40 bg-[#25A7CA]/10"
                                                        : "border-slate-200 bg-white"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
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
                                                </div>

                                                <div className="mt-3 grid gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateIconGroup(id, "main")}
                                                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                            setting?.pdf_group === "main"
                                                                ? "bg-[#25A7CA] text-white"
                                                                : "bg-white text-slate-500 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        Aplicaciones / constructividad
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateIconGroup(id, "optional")}
                                                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                            setting?.pdf_group === "optional"
                                                                ? "bg-slate-800 text-white"
                                                                : "bg-white text-slate-500 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        Opcionales
                                                    </button>
                                                </div>

                                                {setting ? (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-slate-500">Orden</span>
                                                        <select
                                                            value={setting.order || nextOrderForGroup(setting.pdf_group)}
                                                            onChange={(event) => updateIconOrder(id, event.target.value)}
                                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#25A7CA]"
                                                        >
                                                            {ORDER_CODES.map((code, index) => (
                                                                <option key={code} value={index + 1}>
                                                                    {code}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className="text-xs text-slate-400">
                                                            {setting.pdf_group === "optional" ? "Opcionales" : "Aplicaciones"}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    }) : (
                                        <p className="rounded-2xl border border-slate-200 bg-white px-3 py-4 text-sm text-slate-400">
                                            No hay iconos activos cargados.
                                        </p>
                                    )}

                                    {footerIcons.length ? (
                                        <div className="pt-4">
                                            <p className="px-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                                                Pie de página
                                            </p>
                                            <div className="mt-2 space-y-2">
                                                {footerIcons.map((icon) => {
                                                    const id = String(icon.id);
                                                    const setting = iconSetting(id);

                                                    return (
                                                        <div
                                                            key={icon.id}
                                                            className={`rounded-2xl border px-3 py-3 transition ${
                                                                setting?.pdf_group === "footer"
                                                                    ? "border-[#25A7CA]/40 bg-[#25A7CA]/10"
                                                                    : "border-slate-200 bg-white"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
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
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-slate-700">
                                                                        {getText(icon.name, icon.slug)}
                                                                    </p>
                                                                    <p className="text-xs text-slate-400">
                                                                        {icon.footer_side === "right" ? "Lado derecho" : "Lado izquierdo"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => updateIconGroup(id, "footer")}
                                                                className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                                    setting?.pdf_group === "footer"
                                                                        ? "bg-[#25A7CA] text-white"
                                                                        : "bg-white text-slate-500 hover:bg-slate-50"
                                                                }`}
                                                            >
                                                                Pie de página
                                                            </button>

                                                            {setting?.pdf_group === "footer" ? (
                                                                <div className="mt-3 flex items-center gap-2">
                                                                    <span className="text-xs font-semibold text-slate-500">Orden</span>
                                                                    <select
                                                                        value={setting.order || nextOrderForGroup("footer")}
                                                                        onChange={(event) => updateIconOrder(id, event.target.value)}
                                                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#25A7CA]"
                                                                    >
                                                                        {ORDER_CODES.map((code, index) => (
                                                                            <option key={code} value={index + 1}>
                                                                                {code}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                {errors.icon_settings ? (
                                    <p className="mt-2 text-xs font-medium text-red-500">{errors.icon_settings}</p>
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
