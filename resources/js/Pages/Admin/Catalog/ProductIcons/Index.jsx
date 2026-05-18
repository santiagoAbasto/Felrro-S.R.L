import AdminLayout from "@/Layouts/AdminLayout";
import Toast from "@/Components/Toast";
import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { route } from "ziggy-js";

const getName = (icon) => icon.name?.es || icon.name?.en || icon.slug || "Sin nombre";

export default function Index({ icons = [] }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: { es: "", en: "" },
        slug: "",
        order: "",
        placement: "icon",
        footer_side: "left",
        is_active: true,
        image: null,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.product-icons.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const destroyIcon = (id) => {
        if (!confirm("¿Querés eliminar este icono técnico?")) {
            return;
        }

        router.delete(route("admin.product-icons.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Iconos técnicos" />
            <Toast message={flash.success} type="success" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Productos"
                    title="Iconos técnicos"
                    description="Subí y administrá los iconos usados en fichas técnicas, PDFs y pie de productos."
                />

                <AdminSectionCard
                    title="Nuevo icono"
                    description="Cargá el nombre, la ubicación donde se usará y la imagen del icono."
                >
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminTextInput
                                label="Nombre"
                                value={data.name.es}
                                onChange={(value) => setData("name", { ...data.name, es: value })}
                                placeholder="Ej: Baja emisión de humo"
                                error={errors["name.es"]}
                            />

                            <AdminTextInput
                                label="Nombre en inglés"
                                value={data.name.en}
                                onChange={(value) => setData("name", { ...data.name, en: value })}
                                placeholder="Ej: Low smoke emission"
                                error={errors["name.en"]}
                                optional
                            />

                            <AdminTextInput
                                label="Slug"
                                value={data.slug}
                                onChange={(value) => setData("slug", value)}
                                placeholder="Se genera desde el nombre si lo dejás vacío"
                                error={errors.slug}
                                optional
                            />

                            <AdminTextInput
                                label="Orden"
                                value={data.order}
                                onChange={(value) => setData("order", value)}
                                placeholder="Ej: 10"
                                error={errors.order}
                                optional
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">
                                    Ubicación
                                </label>
                                <select
                                    value={data.placement}
                                    onChange={(event) => setData("placement", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                                >
                                    <option value="icon">Ficha técnica</option>
                                    <option value="footer">Pie de producto</option>
                                </select>
                                {errors.placement ? (
                                    <p className="mt-2 text-xs font-medium text-red-500">{errors.placement}</p>
                                ) : null}
                            </div>

                            {data.placement === "footer" ? (
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                                        Lado del pie
                                    </label>
                                    <select
                                        value={data.footer_side}
                                        onChange={(event) => setData("footer_side", event.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10"
                                    >
                                        <option value="left">Izquierda</option>
                                        <option value="right">Derecha</option>
                                    </select>
                                    {errors.footer_side ? (
                                        <p className="mt-2 text-xs font-medium text-red-500">{errors.footer_side}</p>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>

                        <AdminToggle
                            label="Estado del icono"
                            hint="Los iconos activos están disponibles para importaciones y configuración de PDFs."
                            checked={data.is_active}
                            onChange={(value) => setData("is_active", value)}
                            activeText="Activo"
                            inactiveText="Inactivo"
                        />

                        <AdminFileField
                            label="Imagen"
                            value={data.image}
                            onChange={(file) => setData("image", file)}
                            accept="image/png,image/jpeg,image/webp"
                            maxSizeMB={5}
                            error={errors.image}
                            hint="Usá PNG, JPG o WEBP. Conviene que el icono tenga fondo transparente o limpio."
                            buttonLabel="Seleccionar imagen"
                        />

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <Icon icon="svg-spinners:ring-resize" width={14} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="solar:check-circle-outline" width={16} />
                                        Guardar icono
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Iconos cargados"
                    description="Revisá estado, ubicación y orden de los iconos técnicos disponibles."
                >
                    <div className="overflow-hidden rounded-[24px] border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Icono</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Ubicación</th>
                                    <th className="px-4 py-3">Orden</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {icons.length ? icons.map((icon) => (
                                    <tr key={icon.id}>
                                        <td className="px-4 py-4">
                                            {icon.image_url ? (
                                                <img
                                                    src={icon.image_url}
                                                    alt=""
                                                    className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
                                                />
                                            ) : (
                                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                                    <Icon icon="solar:gallery-outline" width={18} />
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-slate-700">{getName(icon)}</p>
                                            <p className="mt-1 text-xs text-slate-400">{icon.slug}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                {icon.placement === "footer" ? "Pie de producto" : "Ficha técnica"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">{icon.order ?? "-"}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    icon.is_active
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-200 text-slate-500"
                                                }`}
                                            >
                                                {icon.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => destroyIcon(icon.id)}
                                                className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                            No hay iconos cargados todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}
