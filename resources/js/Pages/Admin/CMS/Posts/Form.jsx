import {
    AdminFileField,
    AdminPageHeader,
    AdminRichTextarea,
    AdminSectionCard,
    AdminTextInput,
    AdminToggle,
} from "@/Components/Admin/FormElements";

export default function PostForm({
    title,
    description,
    data,
    setData,
    submit,
    processing,
    errors,
    buttonText,
}) {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                eyebrow="Novedades"
                title={title}
                description={description}
            />

            <form onSubmit={submit} className="space-y-8">
                <AdminSectionCard title="Contenido principal">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminTextInput
                            label="Categoría"
                            value={data.category.es}
                            onChange={(value) => setData("category", { ...data.category, es: value })}
                            error={errors["category.es"]}
                        />
                        <AdminTextInput
                            label="Categoría en inglés"
                            value={data.category.en}
                            onChange={(value) => setData("category", { ...data.category, en: value })}
                            error={errors["category.en"]}
                        />
                        <AdminTextInput
                            label="Título"
                            value={data.title.es}
                            onChange={(value) => setData("title", { ...data.title, es: value })}
                            error={errors["title.es"]}
                        />
                        <AdminTextInput
                            label="Título en inglés"
                            value={data.title.en}
                            onChange={(value) => setData("title", { ...data.title, en: value })}
                            error={errors["title.en"]}
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminRichTextarea
                            label="Resumen"
                            value={data.excerpt.es}
                            onChange={(value) => setData("excerpt", { ...data.excerpt, es: value })}
                            maxLength={500}
                            error={errors["excerpt.es"]}
                            optional
                        />
                        <AdminRichTextarea
                            label="Resumen en inglés"
                            value={data.excerpt.en}
                            onChange={(value) => setData("excerpt", { ...data.excerpt, en: value })}
                            maxLength={500}
                            error={errors["excerpt.en"]}
                            optional
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminRichTextarea
                            label="Contenido"
                            value={data.content.es}
                            onChange={(value) => setData("content", { ...data.content, es: value })}
                            error={errors["content.es"]}
                        />
                        <AdminRichTextarea
                            label="Contenido en inglés"
                            value={data.content.en}
                            onChange={(value) => setData("content", { ...data.content, en: value })}
                            error={errors["content.en"]}
                        />
                    </div>
                </AdminSectionCard>

                <AdminSectionCard title="Imagen y publicación">
                    <AdminFileField
                        label="Imagen"
                        value={data.image}
                        onChange={(file) => setData("image", file)}
                        accept="image/png,image/jpeg,image/webp"
                        currentUrl={data.existing_image}
                        currentLabel={data.existing_image ? "Imagen actual" : null}
                        maxSizeMB={5}
                        optional
                        error={errors.image}
                        buttonLabel={data.existing_image ? "Reemplazar imagen" : "Seleccionar imagen"}
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminTextInput
                            label="Orden"
                            value={data.order}
                            onChange={(value) => setData("order", value.toUpperCase())}
                            error={errors.order}
                            optional
                        />
                        <AdminTextInput
                            label="Fecha de publicación"
                            type="date"
                            value={data.published_at}
                            onChange={(value) => setData("published_at", value)}
                            error={errors.published_at}
                            optional
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminToggle
                            label="Destacar novedad"
                            checked={data.is_featured}
                            onChange={(value) => setData("is_featured", value)}
                            activeText="Destacada"
                            inactiveText="Normal"
                        />
                        <AdminToggle
                            label="Mostrar en la web"
                            checked={data.is_active}
                            onChange={(value) => setData("is_active", value)}
                        />
                    </div>
                </AdminSectionCard>

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
        </div>
    );
}
