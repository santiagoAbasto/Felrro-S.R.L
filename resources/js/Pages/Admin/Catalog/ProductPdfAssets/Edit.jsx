import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";

export default function Edit({ product, availableIcons }) {
    const mergedIcons = availableIcons.map((icon, index) => {
        const current = product.icons.find((item) => item.id === icon.id);

        return {
            id: icon.id,
            name: icon.name,
            slug: icon.slug,
            image_url: icon.image_url,
            placement: icon.placement ?? "icon",
            footer_side: icon.footer_side ?? "left",
            show_in_pdf: current?.show_in_pdf ?? false,
            pdf_group: current?.pdf_group ?? (icon.placement === "footer" ? "footer" : "main"),
            order: current?.order ?? index + 1,
        };
    });

    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        pdf_graphic: null,
        pdf_color_table: null,
        remove_pdf_graphic: false,
        remove_pdf_color_table: false,
        icon_settings: mergedIcons,
    });

    const updateIcon = (id, patch) => {
        setData(
            "icon_settings",
            data.icon_settings.map((item) => (item.id === id ? { ...item, ...patch } : item))
        );
    };

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.products.pdf-assets.update", product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`PDF - ${product.name?.es}`} />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Ficha técnica PDF"
                    title={product.name?.es}
                    description="Subí la tabla Formación/Conductores/Vaina, el gráfico principal y elegí qué iconos se imprimen. Al guardar se regenera el PDF."
                    actions={
                        <div className="flex flex-wrap gap-3">
                            {product.ficha_tecnica_url ? (
                                <a
                                    href={product.ficha_tecnica_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <Icon icon="solar:document-text-outline" width={16} />
                                    Abrir PDF
                                </a>
                            ) : null}
                            <Link
                                href={route("admin.products.import.aflamex-potencia.index")}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                            >
                                <Icon icon="solar:upload-square-outline" width={16} />
                                Volver al importador
                            </Link>
                        </div>
                    }
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Tabla Formación / Conductores / Vaina"
                        description="Esta imagen reemplaza la tabla generada del PDF. Se ubica en la columna derecha del bloque Aplicaciones/constructividad."
                    >
                        <AdminFileField
                            label="Imagen que reemplaza la tabla"
                            value={data.pdf_color_table}
                            onChange={(file) => {
                                setData("pdf_color_table", file);
                                setData("remove_pdf_color_table", false);
                            }}
                            accept="image/png,image/jpeg,image/webp"
                            maxSizeMB={5}
                            currentUrl={product.pdf_color_table_url}
                            currentLabel="Tabla específica del PDF"
                            hint="Cargá la imagen exactamente como en el modelo. Se respeta la proporción del archivo."
                            error={errors.pdf_color_table}
                            buttonLabel={product.pdf_color_table_url ? "Reemplazar tabla" : "Elegir tabla"}
                        />

                        {product.pdf_color_table_url ? (
                            <label className="flex cursor-pointer items-center gap-3 rounded-[22px] border border-slate-200 bg-white p-4">
                                <input
                                    type="checkbox"
                                    checked={data.remove_pdf_color_table}
                                    onChange={(event) => setData("remove_pdf_color_table", event.target.checked)}
                                    className="rounded border-slate-300 text-[#25A7CA] focus:ring-[#25A7CA]"
                                />
                                <span className="text-sm font-semibold text-slate-700">
                                    Quitar tabla cargada y volver al fallback generado
                                </span>
                            </label>
                        ) : null}
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Gráfico principal del PDF"
                        description="Este gráfico se usa solo en la ficha PDF. No cambia la imagen pública del producto."
                    >
                        <AdminFileField
                            label="Gráfico / imagen técnica"
                            value={data.pdf_graphic}
                            onChange={(file) => {
                                setData("pdf_graphic", file);
                                setData("remove_pdf_graphic", false);
                            }}
                            accept="image/png,image/jpeg,image/webp"
                            maxSizeMB={5}
                            currentUrl={product.pdf_graphic_url || product.image_url}
                            currentLabel={product.pdf_graphic_url ? "Gráfico específico del PDF" : "Usando imagen pública como respaldo"}
                            hint="Subí el gráfico exacto diseñado para la ficha. Recomendación: PNG horizontal con fondo transparente o blanco."
                            error={errors.pdf_graphic}
                            buttonLabel={product.pdf_graphic_url ? "Reemplazar gráfico" : "Elegir gráfico"}
                        />

                        {product.pdf_graphic_url ? (
                            <label className="flex cursor-pointer items-center gap-3 rounded-[22px] border border-slate-200 bg-white p-4">
                                <input
                                    type="checkbox"
                                    checked={data.remove_pdf_graphic}
                                    onChange={(event) => setData("remove_pdf_graphic", event.target.checked)}
                                    className="rounded border-slate-300 text-[#25A7CA] focus:ring-[#25A7CA]"
                                />
                                <span className="text-sm font-semibold text-slate-700">
                                    Quitar gráfico específico y volver a usar la imagen pública
                                </span>
                            </label>
                        ) : null}
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Iconos que se imprimen"
                        description="Cada switch controla si el icono aparece o no en el PDF. Los iconos de pie de página se imprimen solo como imagen, sin texto."
                        tone="accent"
                    >
                        {data.icon_settings.length === 0 ? (
                            <div className="rounded-[24px] border border-dashed border-[#25A7CA]/30 bg-white/70 px-6 py-10 text-center">
                                <p className="text-sm font-semibold text-slate-700">No hay iconos activos para seleccionar.</p>
                                <Link
                                    href={route("admin.product-icons.index")}
                                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    <Icon icon="solar:gallery-favourite-outline" width={16} />
                                    Cargar iconos
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {data.icon_settings.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`rounded-[24px] border p-4 transition ${
                                            item.show_in_pdf
                                                ? "border-[#25A7CA]/40 bg-white shadow-sm"
                                                : "border-slate-200 bg-white/70"
                                        }`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] bg-slate-50">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name?.es}
                                                        className="max-h-16 max-w-16 object-contain"
                                                    />
                                                ) : (
                                                    <Icon icon="solar:gallery-remove-outline" width={24} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-800">{item.name?.es}</p>
                                                <p className="mt-1 text-xs text-slate-400">{item.slug}</p>
                                                {item.placement === "footer" ? (
                                                    <p className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                        Pie de página · {item.footer_side === "right" ? "Lado derecho" : "Lado izquierdo"}
                                                    </p>
                                                ) : null}
                                                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_130px_100px] sm:items-center">
                                                    <AdminToggle
                                                        label="Mostrar en PDF"
                                                        checked={item.show_in_pdf}
                                                        onChange={(value) => updateIcon(item.id, { show_in_pdf: value })}
                                                        activeText="Imprime"
                                                        inactiveText="No imprime"
                                                    />
                                                    <select
                                                        value={item.pdf_group ?? "main"}
                                                        onChange={(event) => updateIcon(item.id, { pdf_group: event.target.value })}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                                                        aria-label={`Ubicación de ${item.name?.es}`}
                                                    >
                                                        <option value="main">Principal</option>
                                                        <option value="optional">Opcionales</option>
                                                        <option value="footer">Pie de página</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="999"
                                                        value={item.order ?? 0}
                                                        onChange={(event) => updateIcon(item.id, { order: Number(event.target.value) })}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                                                        aria-label={`Orden de ${item.name?.es}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            <Icon icon="solar:refresh-circle-outline" width={17} />
                            {processing ? "Guardando..." : "Guardar y regenerar PDF"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
