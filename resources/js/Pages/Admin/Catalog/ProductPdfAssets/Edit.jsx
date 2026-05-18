import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";

const iconName = (icon) => icon.name?.es || icon.name?.en || icon.slug;

export default function Edit({ product, availableIcons = [] }) {
    const { flash = {} } = usePage().props;
    const currentIconSettings = product.icons || [];
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        pdf_graphic: null,
        pdf_color_table: null,
        remove_pdf_graphic: false,
        remove_pdf_color_table: false,
        icon_settings: availableIcons.map((icon, index) => {
            const existing = currentIconSettings.find((item) => item.id === icon.id);

            return {
                id: icon.id,
                show_in_pdf: existing?.show_in_pdf ?? Boolean(existing),
                pdf_group: existing?.pdf_group || "main",
                order: existing?.order ?? index + 1,
            };
        }),
    });

    const updateIcon = (id, field, value) => {
        setData(
            "icon_settings",
            data.icon_settings.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
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
            <Head title="PDF del producto" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Assets del PDF"
                    description={`Configurá imágenes e iconos del PDF técnico de ${product.name?.es || "este producto"}.`}
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Imágenes del PDF"
                        description="Estas imágenes se usan al regenerar la ficha técnica del producto."
                    >
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-4">
                                <AdminFileField
                                    label="Gráfico principal"
                                    value={data.pdf_graphic}
                                    onChange={(file) => setData("pdf_graphic", file)}
                                    accept="image/png,image/jpeg,image/webp"
                                    currentUrl={product.pdf_graphic_url}
                                    currentLabel={product.pdf_graphic_url ? "Gráfico actual cargado" : null}
                                    error={errors.pdf_graphic}
                                    maxSizeMB={5}
                                    optional
                                    buttonLabel="Seleccionar gráfico"
                                />
                                {product.pdf_graphic_url ? (
                                    <AdminToggle
                                        label="Quitar gráfico actual"
                                        checked={data.remove_pdf_graphic}
                                        onChange={(value) => setData("remove_pdf_graphic", value)}
                                        activeText="Se quitará"
                                        inactiveText="Conservar"
                                    />
                                ) : null}
                            </div>

                            <div className="space-y-4">
                                <AdminFileField
                                    label="Tabla de color"
                                    value={data.pdf_color_table}
                                    onChange={(file) => setData("pdf_color_table", file)}
                                    accept="image/png,image/jpeg,image/webp"
                                    currentUrl={product.pdf_color_table_url}
                                    currentLabel={product.pdf_color_table_url ? "Tabla actual cargada" : null}
                                    error={errors.pdf_color_table}
                                    maxSizeMB={5}
                                    optional
                                    buttonLabel="Seleccionar tabla"
                                />
                                {product.pdf_color_table_url ? (
                                    <AdminToggle
                                        label="Quitar tabla actual"
                                        checked={data.remove_pdf_color_table}
                                        onChange={(value) => setData("remove_pdf_color_table", value)}
                                        activeText="Se quitará"
                                        inactiveText="Conservar"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard
                        title="Iconos del PDF"
                        description="Elegí qué iconos se imprimen, en qué grupo y con qué orden."
                    >
                        <div className="overflow-hidden rounded-[24px] border border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Icono</th>
                                        <th className="px-4 py-3">Mostrar</th>
                                        <th className="px-4 py-3">Grupo</th>
                                        <th className="px-4 py-3">Orden</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {availableIcons.length ? availableIcons.map((icon) => {
                                        const setting = data.icon_settings.find((item) => item.id === icon.id) || {};

                                        return (
                                            <tr key={icon.id}>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {icon.image_url ? (
                                                            <img src={icon.image_url} alt="" className="h-10 w-10 rounded-xl object-contain" />
                                                        ) : (
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                                                <Icon icon="solar:gallery-outline" width={16} />
                                                            </span>
                                                        )}
                                                        <span className="font-semibold text-slate-700">{iconName(icon)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(setting.show_in_pdf)}
                                                        onChange={(event) => updateIcon(icon.id, "show_in_pdf", event.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-[#25A7CA] focus:ring-[#25A7CA]"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <select
                                                        value={setting.pdf_group || "main"}
                                                        onChange={(event) => updateIcon(icon.id, "pdf_group", event.target.value)}
                                                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#25A7CA]"
                                                    >
                                                        <option value="main">Principal</option>
                                                        <option value="optional">Opcional</option>
                                                        <option value="footer">Pie</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="999"
                                                        value={setting.order ?? ""}
                                                        onChange={(event) => updateIcon(icon.id, "order", event.target.value)}
                                                        className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#25A7CA]"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                                No hay iconos activos para asociar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {errors.icon_settings ? (
                            <p className="text-xs font-medium text-red-500">{errors.icon_settings}</p>
                        ) : null}
                    </AdminSectionCard>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                        >
                            {processing ? "Guardando..." : "Guardar assets PDF"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
