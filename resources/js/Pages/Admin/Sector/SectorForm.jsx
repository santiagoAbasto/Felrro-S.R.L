import { useEffect, useMemo, useState } from "react";

const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10";

export default function SectorForm({
    data,
    setData,
    submit,
    processing,
    errors,
    buttonText,
    currentImage = null,
    products = [],
}) {
    const [preview, setPreview] = useState(null);
    const [productSearch, setProductSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        if (data.image instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(data.image);
        } else if (currentImage) {
            setPreview(`/storage/${currentImage}`);
        } else {
            setPreview(null);
        }
    }, [data.image, currentImage]);

    const categoryOptions = useMemo(() => {
        return Array.from(
            new Set(
                products
                    .map((product) => product.category_name?.trim())
                    .filter(Boolean)
            )
        ).sort((left, right) => left.localeCompare(right));
    }, [products]);

    const filteredProducts = useMemo(() => {
        const term = productSearch.trim().toLowerCase();

        return products.filter((product) =>
            (activeCategory === "all" || product.category_name === activeCategory) &&
            (
                !term ||
                [product.name, product.category_name, product.short_description]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(term))
            )
        );
    }, [activeCategory, productSearch, products]);

    const selectedProducts = useMemo(
        () => products.filter((product) => data.related_product_ids.includes(product.id)),
        [products, data.related_product_ids]
    );

    const toggleProduct = (productId) => {
        const isSelected = data.related_product_ids.includes(productId);

        setData(
            "related_product_ids",
            isSelected
                ? data.related_product_ids.filter((id) => id !== productId)
                : [...data.related_product_ids, productId]
        );
    };

    return (
        <form onSubmit={submit} className="space-y-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Nombre (ES)
                    </label>
                    <input
                        type="text"
                        value={data.name.es}
                        onChange={(event) => setData("name", { ...data.name, es: event.target.value })}
                        className={inputClass}
                    />
                    {errors["name.es"] ? <p className="mt-2 text-sm text-red-500">{errors["name.es"]}</p> : null}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Nombre (EN)
                    </label>
                    <input
                        type="text"
                        value={data.name.en}
                        onChange={(event) => setData("name", { ...data.name, en: event.target.value })}
                        className={inputClass}
                    />
                    {errors["name.en"] ? <p className="mt-2 text-sm text-red-500">{errors["name.en"]}</p> : null}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Descripción (ES)
                    </label>
                    <textarea
                        value={data.description.es}
                        onChange={(event) => setData("description", { ...data.description, es: event.target.value })}
                        className={`${inputClass} min-h-32 resize-y`}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Descripción (EN)
                    </label>
                    <textarea
                        value={data.description.en}
                        onChange={(event) => setData("description", { ...data.description, en: event.target.value })}
                        className={`${inputClass} min-h-32 resize-y`}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">
                    Imagen del sector
                </label>

                {preview ? (
                    <div className="relative h-44 w-72 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                ) : null}

                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setData("image", event.target.files[0])}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-2xl file:border-0 file:bg-[#25A7CA] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
                />

                {errors.image ? <p className="text-sm text-red-500">{errors.image}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr] md:items-end">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Orden
                    </label>
                    <input
                        type="text"
                        value={data.order}
                        onChange={(event) => setData("order", event.target.value.toUpperCase())}
                        className={`${inputClass} uppercase`}
                        placeholder="Ej: A, AA, AB"
                    />
                    {errors.order ? <p className="mt-2 text-sm text-red-500">{errors.order}</p> : null}
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(event) => setData("is_active", event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#25A7CA] focus:ring-[#25A7CA]"
                    />
                    <span className="text-sm font-medium text-slate-700">Sector activo</span>
                </label>
            </div>

            <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Productos relacionados</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                            Seleccioná los productos que van a aparecer en el modal de este sector en la web pública.
                        </p>
                    </div>

                    <div className="grid w-full gap-4 lg:max-w-2xl lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Buscar producto
                            </label>
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(event) => setProductSearch(event.target.value)}
                                placeholder="Buscar por nombre, categoría o descripción"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Filtrar por categoría
                            </label>
                            <select
                                value={activeCategory}
                                onChange={(event) => setActiveCategory(event.target.value)}
                                className={inputClass}
                            >
                                <option value="all">Todas las categorías</option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {categoryOptions.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveCategory("all")}
                            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                                activeCategory === "all"
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            Todas
                        </button>
                        {categoryOptions.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                                    activeCategory === category
                                        ? "bg-[#25A7CA] text-white"
                                        : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                ) : null}

                {selectedProducts.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {selectedProducts.map((product) => (
                            <button
                                key={`selected-${product.id}`}
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                className="inline-flex items-center gap-2 rounded-full bg-[#25A7CA]/10 px-3 py-2 text-xs font-semibold text-[#117a98] transition hover:bg-[#25A7CA]/20"
                            >
                                <span>{product.name}</span>
                                <span className="text-[10px] uppercase tracking-wide text-[#25A7CA]">Quitar</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-400">
                        Todavía no hay productos asociados a este sector.
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                        {filteredProducts.length} resultado{filteredProducts.length === 1 ? "" : "s"} disponibles
                    </p>
                    {(productSearch || activeCategory !== "all") ? (
                        <button
                            type="button"
                            onClick={() => {
                                setProductSearch("");
                                setActiveCategory("all");
                            }}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-white"
                        >
                            Limpiar filtros
                        </button>
                    ) : null}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => {
                        const isSelected = data.related_product_ids.includes(product.id);

                        return (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                className={`group overflow-hidden rounded-[24px] border bg-white text-left transition ${
                                    isSelected
                                        ? "border-[#25A7CA] shadow-lg shadow-[#25A7CA]/10 ring-2 ring-[#25A7CA]/15"
                                        : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                                }`}
                            >
                                <div className="flex gap-4 p-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        {product.category_name ? (
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#25A7CA]">
                                                {product.category_name}
                                            </p>
                                        ) : null}

                                        <h4 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">
                                            {product.name}
                                        </h4>

                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                            {product.short_description || "Sin descripción breve."}
                                        </p>
                                    </div>
                                </div>

                                <div className={`flex items-center justify-between border-t px-4 py-3 text-xs font-semibold ${
                                    isSelected
                                        ? "border-[#25A7CA]/20 bg-[#25A7CA]/5 text-[#117a98]"
                                        : "border-slate-100 text-slate-500"
                                }`}>
                                    <span>{isSelected ? "Producto asociado" : "Click para asociar"}</span>
                                    <span className="uppercase tracking-[0.18em]">
                                        {isSelected ? "Seleccionado" : "Disponible"}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-400">
                        No encontré productos con esa búsqueda.
                    </div>
                ) : null}

                {errors.related_product_ids ? (
                    <p className="mt-4 text-sm text-red-500">{errors.related_product_ids}</p>
                ) : null}
            </section>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-2xl bg-[#25A7CA] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#1d96b8] disabled:opacity-50"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
}
