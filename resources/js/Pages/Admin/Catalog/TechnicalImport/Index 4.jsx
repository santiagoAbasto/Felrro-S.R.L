import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
} from "@/Components/Admin/FormElements";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";

export default function Index({ icons, categories, batches, products }) {
    const technicalIcons = icons.filter((item) => item.placement !== "footer");
    const footerIcons = icons.filter((item) => item.placement === "footer");

    const { data, setData, post, processing, errors } = useForm({
        category_id: "",
        technical_excel: null,
        cover_excel: null,
        pdf_color_table: null,
        icon_ids: icons.map((item) => item.id),
    });

    const toggleIcon = (id) => {
        const next = data.icon_ids.includes(id)
            ? data.icon_ids.filter((item) => item !== id)
            : [...data.icon_ids, id];

        setData("icon_ids", next);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.products.import.aflamex-potencia.store"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const cleanLatest = () => {
        if (!confirm("¿Limpiar la última importación? Los productos importados se eliminan de la vista pública.")) {
            return;
        }

        router.delete(route("admin.products.import.aflamex-potencia.destroy-latest"), {
            preserveScroll: true,
        });
    };

    const cleanBatch = (batch) => {
        if (!confirm(`¿Limpiar la importación #${batch.id}? Los productos de ese lote se eliminan de la vista pública.`)) {
            return;
        }

        router.delete(route("admin.products.import.aflamex-potencia.destroy", batch.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Importar productos" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Importación técnica"
                    title="Importar productos"
                    description="Seleccioná la categoría de destino, procesá el Excel técnico y generá automáticamente la ficha PDF de cada variante."
                    actions={
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={cleanLatest}
                                className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                            >
                                <Icon icon="solar:trash-bin-trash-outline" width={16} />
                                Limpiar última importación
                            </button>
                            <Link
                                href={route("admin.product-icons.index")}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                <Icon icon="solar:gallery-favourite-outline" width={16} />
                                Gestionar iconos
                            </Link>
                        </div>
                    }
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Categoría de destino"
                        description="Elegí primero a qué categoría pertenecen los productos de este Excel. Todos los productos importados se publicarán dentro de esa categoría."
                        tone="accent"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Categoría
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(event) => setData("category_id", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name?.es ?? category.slug}
                                    </option>
                                ))}
                            </select>
                            <Error text={errors.category_id} />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Archivos de origen"
                        description="El Excel técnico es obligatorio. El Excel de carátulas completa descripciones, aplicaciones, construcción, información adicional e imagen principal."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminFileField
                                label="Excel técnico"
                                value={data.technical_excel}
                                onChange={(file) => setData("technical_excel", file)}
                                accept=".xlsx"
                                maxSizeMB={10}
                                error={errors.technical_excel}
                                kind="document"
                                buttonLabel="Elegir Excel técnico"
                                hint="Ej: AFLAMEX POTENCIA PVC.xlsx"
                            />
                            <AdminFileField
                                label="Excel de carátulas"
                                value={data.cover_excel}
                                onChange={(file) => setData("cover_excel", file)}
                                accept=".xlsx"
                                maxSizeMB={10}
                                error={errors.cover_excel}
                                kind="document"
                                buttonLabel="Elegir carátulas"
                                hint="Ej: CARATULAS POTENCIA PVC.xlsx"
                                optional
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Iconos para el PDF"
                        description="Seleccioná los iconos técnicos de portada y los iconos de pie de página que deben aplicarse a las fichas generadas."
                        tone="accent"
                    >
                        {technicalIcons.length === 0 ? (
                            <div className="rounded-[24px] border border-dashed border-[#25A7CA]/30 bg-white/70 px-6 py-10 text-center">
                                <p className="text-sm font-semibold text-slate-700">Primero cargá los iconos técnicos.</p>
                                <Link
                                    href={route("admin.product-icons.index")}
                                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    <Icon icon="solar:upload-outline" width={16} />
                                    Subir iconos
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {technicalIcons.map((item) => {
                                    const active = data.icon_ids.includes(item.id);

                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => toggleIcon(item.id)}
                                            className={`flex items-center gap-3 rounded-[22px] border p-3 text-left transition ${
                                                active
                                                    ? "border-[#25A7CA] bg-white shadow-sm"
                                                    : "border-slate-200 bg-white/70 hover:bg-white"
                                            }`}
                                        >
                                            <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-[#25A7CA] bg-[#25A7CA] text-white" : "border-slate-300 text-transparent"}`}>
                                                <Icon icon="solar:check-read-outline" width={13} />
                                            </span>
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name?.es} className="h-10 w-10 object-contain" />
                                            ) : null}
                                            <span className="text-sm font-semibold text-slate-700">{item.name?.es}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <Error text={errors.icon_ids} />

                        <div className="mt-8 border-t border-[#25A7CA]/15 pt-6">
                            <AdminFileField
                                label="Imagen Formación / Conductores / Vaina"
                                value={data.pdf_color_table}
                                onChange={(file) => setData("pdf_color_table", file)}
                                accept="image/png,image/jpeg,image/webp"
                                maxSizeMB={5}
                                currentLabel="Reemplaza la tabla generada del PDF"
                                hint="Cargá acá la imagen final de la tabla. Se aplica a todos los productos importados en este proceso."
                                error={errors.pdf_color_table}
                                buttonLabel="Elegir imagen de tabla"
                            />
                        </div>

                        <div className="mt-8 border-t border-[#25A7CA]/15 pt-6">
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-slate-800">Al pie de página</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Seleccioná los iconos que se imprimirán encima de la leyenda legal. En el PDF se muestra solo la imagen, sin texto.
                                </p>
                            </div>

                            {footerIcons.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-[#25A7CA]/30 bg-white/70 px-6 py-8 text-center">
                                    <p className="text-sm font-semibold text-slate-700">Todavía no hay iconos configurados para pie de página.</p>
                                    <Link
                                        href={route("admin.product-icons.index")}
                                        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white"
                                    >
                                        <Icon icon="solar:upload-outline" width={16} />
                                        Cargar icono de pie de página
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {footerIcons.map((item) => {
                                        const active = data.icon_ids.includes(item.id);

                                        return (
                                            <button
                                                type="button"
                                                key={item.id}
                                                onClick={() => toggleIcon(item.id)}
                                                className={`flex items-center gap-3 rounded-[22px] border p-3 text-left transition ${
                                                    active
                                                        ? "border-[#25A7CA] bg-white shadow-sm"
                                                        : "border-slate-200 bg-white/70 hover:bg-white"
                                                }`}
                                            >
                                                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-[#25A7CA] bg-[#25A7CA] text-white" : "border-slate-300 text-transparent"}`}>
                                                    <Icon icon="solar:check-read-outline" width={13} />
                                                </span>
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name?.es} className="h-10 w-10 object-contain" />
                                                ) : null}
                                                <span>
                                                    <span className="block text-sm font-semibold text-slate-700">{item.name?.es}</span>
                                                    <span className="mt-1 block text-xs font-semibold text-[#117a98]">
                                                        {item.footer_side === "right" ? "Lado derecho" : "Lado izquierdo"}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            <Icon icon="solar:file-send-outline" width={17} />
                            {processing ? "Procesando..." : "Procesar y generar PDFs"}
                        </button>
                    </div>
                </form>

                <div className="grid gap-8 xl:grid-cols-[1fr_0.85fr]">
                    <AdminSectionCard
                        title="Productos técnicos recientes"
                        description="Después de importar, cada producto queda con su ficha técnica PDF generada."
                    >
                        <div className="overflow-hidden rounded-[24px] border border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Producto</th>
                                        <th className="px-4 py-3">Secciones técnicas</th>
                                        <th className="px-4 py-3 text-right">Ficha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-10 text-center text-slate-400">
                                                Todavía no hay productos técnicos importados.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-4 py-4">
                                                    <p className="font-semibold text-slate-700">{product.name?.es}</p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {product.category?.name?.es ? `${product.category.name.es} · ` : ""}
                                                        {product.slug}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4 text-slate-600">
                                                    {product.technical_sections_count}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route("admin.products.pdf-assets.edit", product.id)}
                                                            className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                        >
                                                            Subir tabla/iconos
                                                        </Link>
                                                        {product.ficha_tecnica_url ? (
                                                            <a
                                                                href={product.ficha_tecnica_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                            >
                                                                Abrir PDF
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">Sin PDF</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Últimas importaciones"
                        description="Resumen rápido de los últimos procesos ejecutados."
                    >
                        <div className="space-y-3">
                            {batches.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-400">
                                    No hay importaciones registradas.
                                </div>
                            ) : (
                                batches.map((batch) => (
                                    <div key={batch.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-800">Lote #{batch.id}</p>
                                                <p className="mt-1 text-xs text-slate-400">{batch.technical_file}</p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                batch.status === "cleaned"
                                                    ? "bg-slate-100 text-slate-500"
                                                    : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <p className="text-sm text-slate-500">
                                                {(batch.summary ?? []).length} producto{(batch.summary ?? []).length === 1 ? "" : "s"} procesado{(batch.summary ?? []).length === 1 ? "" : "s"}.
                                            </p>
                                            {batch.status !== "cleaned" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => cleanBatch(batch)}
                                                    className="shrink-0 rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                >
                                                    Limpiar
                                                </button>
                                            ) : null}
                                        </div>
                                        {(batch.errors ?? []).length > 0 ? (
                                            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
                                                {(batch.errors ?? []).map((warning, index) => (
                                                    <p key={`${batch.id}-warning-${index}`}>{warning}</p>
                                                ))}
                                            </div>
                                        ) : null}
                                        {(batch.summary ?? []).length > 0 ? (
                                            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100">
                                                {(batch.summary ?? []).map((item) => (
                                                    <div key={`${batch.id}-${item.sheet}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-100 px-4 py-2 text-xs last:border-b-0">
                                                        <div>
                                                            <p className="font-semibold text-slate-700">{item.sheet}</p>
                                                            {(item.empty_sections ?? []).length > 0 ? (
                                                                <p className="mt-0.5 text-slate-400">
                                                                    Bloques sin filas: {(item.empty_sections ?? []).join(", ")}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={item.complete === false ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
                                                                {item.rows}/{item.expected_rows ?? item.rows} filas
                                                            </p>
                                                            <p className="mt-0.5 text-slate-400">
                                                                {item.sections}/{item.expected_sections ?? item.sections} tablas
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </div>
                    </AdminSectionCard>
                </div>
            </div>
        </AdminLayout>
    );
}

function Error({ text }) {
    return text ? <p className="mt-2 text-xs font-medium text-red-500">{text}</p> : null;
}
