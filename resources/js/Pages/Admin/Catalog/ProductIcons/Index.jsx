import {
    AdminFileField,
    AdminPageHeader,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { route } from "ziggy-js";

const blankIcon = () => ({
    name_es: "",
    name_en: "",
    slug: "",
    order: "",
    placement: "icon",
    footer_side: "left",
    is_active: true,
    image: null,
});

export default function Index({ icons }) {
    const { data, setData, post, processing, errors } = useForm({
        icon_items: [blankIcon()],
    });
    const [editingId, setEditingId] = useState(null);
    const editForm = useForm({
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
            onSuccess: () => setData("icon_items", [blankIcon()]),
        });
    };

    const updateItem = (index, patch) => {
        setData(
            "icon_items",
            data.icon_items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
        );
    };

    const addItem = () => {
        setData("icon_items", [...data.icon_items, blankIcon()]);
    };

    const removeItem = (index) => {
        if (data.icon_items.length === 1) {
            updateItem(index, blankIcon());
            return;
        }

        setData("icon_items", data.icon_items.filter((_, itemIndex) => itemIndex !== index));
    };

    const destroy = (id) => {
        if (!confirm("¿Eliminar este icono técnico?")) {
            return;
        }

        router.delete(route("admin.product-icons.destroy", id), { preserveScroll: true });
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        editForm.clearErrors();
        editForm.setData({
            name: {
                es: item.name?.es ?? "",
                en: item.name?.en ?? item.name?.es ?? "",
            },
            slug: item.slug ?? "",
            order: item.order ?? "",
            placement: item.placement ?? "icon",
            footer_side: item.footer_side ?? "left",
            is_active: Boolean(item.is_active),
            image: null,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        editForm.clearErrors();
        editForm.reset();
    };

    const submitEdit = (event, item) => {
        event.preventDefault();

        editForm.post(route("admin.product-icons.update-post", item.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: cancelEdit,
        });
    };

    return (
        <AdminLayout>
            <Head title="Iconos técnicos" />

            <div className="space-y-8">
                <AdminPageHeader
                    eyebrow="Catálogo técnico"
                    title="Iconos para fichas"
                    description="Subí cada icono con un nombre claro. Se guardan en storage y después se pueden seleccionar al importar fichas técnicas."
                />

                <form onSubmit={submit} className="space-y-8">
                    <AdminSectionCard
                        title="Nuevos iconos"
                        description="Agregá una fila por cada icono. Cada uno guarda su título y su archivo/logo en storage."
                    >
                        <div className="space-y-5">
                            {data.icon_items.map((item, index) => (
                                <div key={index} className="rounded-[24px] border border-slate-200 bg-white p-5">
                                    <div className="mb-5 flex items-center justify-between gap-4">
                                        <p className="text-sm font-semibold text-slate-700">Icono #{index + 1}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                                        >
                                            Quitar fila
                                        </button>
                                    </div>

                                    <div className="grid gap-6 lg:grid-cols-2">
                                        <AdminTextInput
                                            label="Título"
                                            value={item.name_es}
                                            onChange={(value) => updateItem(index, { name_es: value })}
                                            placeholder="Ej: No propagación del fuego"
                                            error={errors[`icon_items.${index}.name_es`]}
                                        />
                                        <AdminTextInput
                                            label="Título en inglés"
                                            value={item.name_en}
                                            onChange={(value) => updateItem(index, { name_en: value })}
                                            placeholder="Opcional"
                                            error={errors[`icon_items.${index}.name_en`]}
                                            optional
                                        />
                                        <AdminTextInput
                                            label="Slug / nombre técnico"
                                            value={item.slug}
                                            onChange={(value) => updateItem(index, { slug: value })}
                                            placeholder="no-propagacion-fuego"
                                            hint="Si lo dejás vacío se genera desde el título."
                                            error={errors[`icon_items.${index}.slug`]}
                                            optional
                                        />
                                        <AdminTextInput
                                            label="Orden"
                                            value={item.order}
                                            onChange={(value) => updateItem(index, { order: value.toUpperCase() })}
                                            placeholder="A"
                                            error={errors[`icon_items.${index}.order`]}
                                            optional
                                        />
                                        <SelectField
                                            label="Ubicación en PDF"
                                            value={item.placement}
                                            onChange={(value) => updateItem(index, { placement: value })}
                                            options={[
                                                { value: "icon", label: "Iconos técnicos" },
                                                { value: "footer", label: "Pie de página" },
                                            ]}
                                            error={errors[`icon_items.${index}.placement`]}
                                        />
                                        <SelectField
                                            label="Lado del pie de página"
                                            value={item.footer_side}
                                            onChange={(value) => updateItem(index, { footer_side: value })}
                                            options={[
                                                { value: "left", label: "Lado izquierdo" },
                                                { value: "right", label: "Lado derecho" },
                                            ]}
                                            error={errors[`icon_items.${index}.footer_side`]}
                                            disabled={item.placement !== "footer"}
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <AdminToggle
                                            label="Icono activo"
                                            hint="Los iconos activos aparecen para seleccionar en el importador y en cada PDF."
                                            checked={item.is_active}
                                            onChange={(value) => updateItem(index, { is_active: value })}
                                        />
                                    </div>

                                    <div className="mt-5">
                                            <AdminFileField
                                                label="Archivo / logo"
                                                value={item.image}
                                                onChange={(file) => updateItem(index, { image: file })}
                                                accept="image/png,image/jpeg,image/webp"
                                                maxSizeMB={5}
                                                hint={item.placement === "footer"
                                                    ? "Para pie de página se imprime solo la imagen, sin texto."
                                                    : "Recomendado: 635 x 635 px. En el PDF el título se imprime debajo del icono."
                                                }
                                                error={errors[`icon_items.${index}.image`]}
                                                buttonLabel="Elegir logo"
                                            />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-between gap-3">
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                <Icon icon="solar:add-circle-outline" width={16} />
                                Añadir otro icono
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                            >
                                <Icon icon="solar:diskette-outline" width={16} />
                                {processing ? "Guardando..." : "Guardar iconos"}
                            </button>
                        </div>
                    </AdminSectionCard>
                </form>

                <AdminSectionCard
                    title="Iconos cargados"
                    description="Estos son los recursos disponibles para las fichas técnicas generadas desde el Excel."
                >
                    {icons.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-400">
                            Todavía no hay iconos cargados.
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {icons.map((item) => (
                                <div key={item.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                                    <div className="flex h-28 items-center justify-center rounded-[20px] bg-slate-50">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name?.es}
                                                className="max-h-24 max-w-full object-contain"
                                            />
                                        ) : (
                                            <Icon icon="solar:gallery-remove-outline" width={28} className="text-slate-300" />
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-semibold text-slate-800">{item.name?.es}</p>
                                        <p className="mt-1 text-xs text-slate-400">{item.slug}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                                Orden: {item.order || "Sin orden"}
                                            </p>
                                            <p className="inline-flex rounded-full bg-[#25A7CA]/10 px-3 py-1 text-xs font-semibold text-[#117a98]">
                                                {item.placement === "footer" ? "Pie de página" : "Iconos técnicos"}
                                            </p>
                                            {item.placement === "footer" ? (
                                                <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                    {item.footer_side === "right" ? "Lado derecho" : "Lado izquierdo"}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                            {item.is_active ? "Activo" : "Oculto"}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(item)}
                                                className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => destroy(item.id)}
                                                className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    {editingId === item.id ? (
                                        <form
                                            onSubmit={(event) => submitEdit(event, item)}
                                            className="mt-5 space-y-5 rounded-[22px] border border-[#25A7CA]/20 bg-[#25A7CA]/[0.04] p-4"
                                        >
                                            <div className="grid gap-4">
                                                <AdminTextInput
                                                    label="Título"
                                                    value={editForm.data.name.es}
                                                    onChange={(value) =>
                                                        editForm.setData("name", {
                                                            ...editForm.data.name,
                                                            es: value,
                                                        })
                                                    }
                                                    error={editForm.errors["name.es"]}
                                                />
                                                <AdminTextInput
                                                    label="Título en inglés"
                                                    value={editForm.data.name.en}
                                                    onChange={(value) =>
                                                        editForm.setData("name", {
                                                            ...editForm.data.name,
                                                            en: value,
                                                        })
                                                    }
                                                    error={editForm.errors["name.en"]}
                                                    optional
                                                />
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <AdminTextInput
                                                        label="Slug / nombre técnico"
                                                        value={editForm.data.slug}
                                                        onChange={(value) => editForm.setData("slug", value)}
                                                        error={editForm.errors.slug}
                                                        optional
                                                    />
                                                    <AdminTextInput
                                                        label="Orden"
                                                        value={editForm.data.order}
                                                        onChange={(value) => editForm.setData("order", value.toUpperCase())}
                                                        error={editForm.errors.order}
                                                        optional
                                                    />
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <SelectField
                                                        label="Ubicación en PDF"
                                                        value={editForm.data.placement}
                                                        onChange={(value) => editForm.setData("placement", value)}
                                                        options={[
                                                            { value: "icon", label: "Iconos técnicos" },
                                                            { value: "footer", label: "Pie de página" },
                                                        ]}
                                                        error={editForm.errors.placement}
                                                    />
                                                    <SelectField
                                                        label="Lado del pie de página"
                                                        value={editForm.data.footer_side}
                                                        onChange={(value) => editForm.setData("footer_side", value)}
                                                        options={[
                                                            { value: "left", label: "Lado izquierdo" },
                                                            { value: "right", label: "Lado derecho" },
                                                        ]}
                                                        error={editForm.errors.footer_side}
                                                        disabled={editForm.data.placement !== "footer"}
                                                    />
                                                </div>
                                                <AdminToggle
                                                    label="Icono activo"
                                                    hint="Si está apagado no aparece para seleccionar."
                                                    checked={editForm.data.is_active}
                                                    onChange={(value) => editForm.setData("is_active", value)}
                                                />
                                                <AdminFileField
                                                    label="Reemplazar archivo / logo"
                                                    value={editForm.data.image}
                                                    onChange={(file) => editForm.setData("image", file)}
                                                    accept="image/png,image/jpeg,image/webp"
                                                    maxSizeMB={5}
                                                    currentUrl={item.image_url}
                                                    currentLabel="Icono actual"
                                                    hint={editForm.data.placement === "footer"
                                                        ? "Opcional. En el pie de página se imprime solo la imagen, sin texto."
                                                        : "Opcional. Si no elegís otro archivo, se conserva el icono actual."
                                                    }
                                                    error={editForm.errors.image}
                                                    buttonLabel="Elegir nuevo logo"
                                                    optional
                                                />
                                            </div>
                                            <div className="flex flex-wrap justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={editForm.processing}
                                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8] disabled:opacity-60"
                                                >
                                                    <Icon icon="solar:diskette-outline" width={16} />
                                                    {editForm.processing ? "Actualizando..." : "Actualizar icono"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </AdminSectionCard>
            </div>
        </AdminLayout>
    );
}

function SelectField({ label, value, onChange, options, error, disabled = false }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
        </div>
    );
}
