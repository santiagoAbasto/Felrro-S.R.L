import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

const hasValue = (value) => {
    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    return Boolean(value);
};

const hasAnySeoData = (page) =>
    hasValue(page.title) ||
    hasValue(page.description) ||
    hasValue(page.keywords) ||
    hasValue(page.og_image_url);

const isSeoConfigured = (page) =>
    hasValue(page.title) &&
    hasValue(page.description) &&
    hasValue(page.keywords);

function SeoChecklist({ page }) {
    const checks = [
        {
            label: "Titulo cargado",
            done: hasValue(page.title),
        },
        {
            label: "Descripcion cargada",
            done: hasValue(page.description),
        },
        {
            label: "Palabras clave",
            done: hasValue(page.keywords),
        },
        {
            label: "Imagen social",
            done: hasValue(page.og_image_url),
            optional: true,
        },
    ];

    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {checks.map((item) => (
                <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs ${
                        item.done
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : item.optional
                                ? "border-slate-200 bg-slate-50 text-slate-500"
                                : "border-amber-100 bg-amber-50 text-amber-700"
                    }`}
                >
                    <Icon
                        icon={item.done ? "solar:check-circle-bold" : "solar:close-circle-outline"}
                        width={14}
                    />
                    <span>{item.label}</span>
                    {item.optional && !item.done ? (
                        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                            Opcional
                        </span>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

function MetaForm({ page }) {
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, errors, transform } = useForm({
        page: page.key,
        title: page.title || "",
        description: page.description || "",
        keywords: page.keywords || "",
        og_image: null,
        remove_og_image: false,
    });
    const [previewOg, setPreviewOg] = useState(page.og_image_url || null);

    const submitPayload = (payload, { closeOnSuccess = true } = {}) => {
        const identity = (current) => current;

        transform(() => payload);
        post(route("admin.seo.upsert"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                transform(identity);

                if (closeOnSuccess) {
                    setOpen(false);
                }
            },
            onFinish: () => transform(identity),
        });
    };

    const submit = (event) => {
        event.preventDefault();
        submitPayload(data);
    };

    const clearSelectedImage = () => {
        setPreviewOg(null);
        setData((current) => ({
            ...current,
            og_image: null,
            remove_og_image: true,
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const clearSection = () => {
        const clearedData = {
            page: page.key,
            title: "",
            description: "",
            keywords: "",
            og_image: null,
            remove_og_image: true,
        };

        setPreviewOg(null);
        setData(clearedData);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        submitPayload(clearedData);
    };

    const isConfigured = isSeoConfigured(page);
    const hasPartialData = hasAnySeoData(page);
    const statusTone = isConfigured
        ? "bg-emerald-500"
        : hasPartialData
            ? "bg-amber-400"
            : "bg-slate-300";
    const statusBadgeClass = isConfigured
        ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
        : hasPartialData
            ? "border border-amber-100 bg-amber-50 text-amber-700"
            : "border border-slate-200 bg-slate-50 text-slate-500";
    const statusLabel = isConfigured
        ? "Configurado"
        : hasPartialData
            ? "Incompleto"
            : "Sin configurar";
    const statusSummary = isConfigured
        ? data.title
        : hasPartialData
            ? "Faltan completar campos importantes"
            : "Todavia no se cargo SEO en esta pagina";

    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80"
            >
                <div className="min-w-0 flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusTone}`} />
                    <span className="truncate text-sm font-semibold text-slate-800">
                        {page.label}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass}`}>
                        {statusLabel}
                    </span>
                    <span className="hidden truncate text-xs text-slate-400 sm:block">
                        {statusSummary}
                    </span>
                </div>

                <Icon
                    icon={open ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"}
                    width={18}
                    className="shrink-0 text-slate-400"
                />
            </button>

            {open ? (
                <form onSubmit={submit} className="space-y-5 border-t border-slate-100 px-5 py-5">
                    <div className="rounded-[24px] border border-[#25A7CA]/15 bg-[#25A7CA]/5 p-4">
                        <p className="text-sm font-semibold text-slate-800">
                            Enfoque recomendado para {page.label}
                        </p>
                        <div className="mt-3 grid gap-3 lg:grid-cols-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#117a98]">
                                    Titulo
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                    {page.recommended_title}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#117a98]">
                                    Descripcion
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                    {page.recommended_description}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#117a98]">
                                    Palabras clave
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                    {page.recommended_keywords}
                                </p>
                            </div>
                        </div>
                    </div>

                    <SeoChecklist
                        page={{
                            ...page,
                            title: data.title,
                            description: data.description,
                            keywords: data.keywords,
                            og_image_url: previewOg,
                        }}
                    />

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">
                            Titulo de la pagina
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(event) => setData("title", event.target.value)}
                            maxLength={160}
                            placeholder={`Ej: ${page.label} | Felrro`}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-2 focus:ring-[#25A7CA]/20"
                        />
                        <div className="mt-1 flex items-start justify-between gap-3">
                            <p className="text-xs leading-relaxed text-slate-400">
                                Es el texto principal que suele mostrar Google. Idealmente entre 50 y 60 caracteres.
                            </p>
                            <span className={`shrink-0 text-xs ${data.title.length > 60 ? "text-amber-500" : "text-slate-300"}`}>
                                {data.title.length}/60
                            </span>
                        </div>
                        {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">
                            Descripcion
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(event) => setData("description", event.target.value)}
                            maxLength={320}
                            rows={4}
                            placeholder="Explica brevemente que encontrara una persona en esta pagina."
                            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-2 focus:ring-[#25A7CA]/20"
                        />
                        <div className="mt-1 flex items-start justify-between gap-3">
                            <p className="text-xs leading-relaxed text-slate-400">
                                Debe resumir la pagina con claridad. Lo mas fuerte suele funcionar entre 120 y 160 caracteres.
                            </p>
                            <span className={`shrink-0 text-xs ${data.description.length > 160 ? "text-amber-500" : "text-slate-300"}`}>
                                {data.description.length}/160
                            </span>
                        </div>
                        {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description}</p> : null}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">
                            Palabras clave
                        </label>
                        <input
                            type="text"
                            value={data.keywords}
                            onChange={(event) => setData("keywords", event.target.value)}
                            maxLength={500}
                            placeholder="cables especiales, industria, calidad, soluciones electricas"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-2 focus:ring-[#25A7CA]/20"
                        />
                        <div className="mt-1 flex items-start justify-between gap-3">
                            <p className="text-xs leading-relaxed text-slate-400">
                                Separalas con comas y usa terminos reales con los que un cliente buscaria esta pagina.
                            </p>
                            <span className={`shrink-0 text-xs ${data.keywords.length > 400 ? "text-amber-500" : "text-slate-300"}`}>
                                {data.keywords.length}/500
                            </span>
                        </div>
                        {errors.keywords ? <p className="mt-1 text-xs text-red-500">{errors.keywords}</p> : null}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">
                            Imagen para compartir
                        </label>

                        {previewOg ? (
                            <div className="mb-3 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-3">
                                <img
                                    src={previewOg}
                                    className="h-32 w-full rounded-[18px] object-cover"
                                    alt={`Vista previa SEO de ${page.label}`}
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    Se usara cuando compartan el link por WhatsApp, LinkedIn o Facebook.
                                </p>
                            </div>
                        ) : null}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;

                                if (!file) {
                                    return;
                                }

                                setData((current) => ({
                                    ...current,
                                    og_image: file,
                                    remove_og_image: false,
                                }));
                                setPreviewOg(URL.createObjectURL(file));
                            }}
                            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-[#25A7CA]/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#117a98]"
                        />

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-xs leading-relaxed text-slate-400">
                                Medida ideal: 1200 x 630 px. Si no cargas imagen, el SEO sigue funcionando.
                            </p>
                            {previewOg ? (
                                <button
                                    type="button"
                                    onClick={clearSelectedImage}
                                    className="shrink-0 text-xs font-semibold text-red-500 transition hover:text-red-600"
                                >
                                    Quitar imagen
                                </button>
                            ) : null}
                        </div>
                        {errors.og_image ? <p className="mt-1 text-xs text-red-500">{errors.og_image}</p> : null}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={clearSection}
                            disabled={processing}
                            className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                        >
                            Limpiar esta seccion
                        </button>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
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
                                        Guardar SEO
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            ) : null}
        </div>
    );
}

export default function SeoIndex({ pages = [] }) {
    const configured = pages.filter(isSeoConfigured).length;
    const incomplete = pages.filter((page) => hasAnySeoData(page) && !isSeoConfigured(page)).length;

    return (
        <AdminLayout>
            <Head title="Metadatos SEO" />

            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Metadatos SEO
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm text-slate-500">
                        Desde aca definis como se ve cada pagina en Google y cuando alguien comparte un link por WhatsApp o redes. Si una seccion esta completa, se marca en verde.
                    </p>
                </div>

                <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25A7CA]/10 text-[#117a98]">
                                <Icon icon="solar:chart-2-outline" width={22} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Estado general del SEO
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {configured} de {pages.length} paginas ya estan listas.
                                    {incomplete > 0 ? ` ${incomplete} todavia estan incompletas.` : " No quedan secciones a medio hacer."}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${pages.length ? (configured / pages.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                            <Icon icon="solar:check-circle-bold" width={16} />
                            Cuando queda bien configurado
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-emerald-700">
                            Una seccion pasa a verde cuando tiene titulo, descripcion y palabras clave. La imagen para compartir suma mucho, pero la dejamos opcional.
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-[28px] border border-[#25A7CA]/15 bg-[#25A7CA]/5 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                        Guia rapida para escribir un buen SEO
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {[
                            {
                                icon: "solar:magnifer-outline",
                                title: "Pensa en como te buscarian",
                                desc: "Usa palabras reales de clientes y no frases internas de la empresa.",
                            },
                            {
                                icon: "solar:text-outline",
                                title: "Se claro antes que creativo",
                                desc: "Lo importante es que Google y la persona entiendan rapido que ofrece esa pagina.",
                            },
                            {
                                icon: "solar:smartphone-outline",
                                title: "Cuidá como se comparte",
                                desc: "Una buena imagen social mejora mucho la presencia en WhatsApp, LinkedIn y Facebook.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-[22px] border border-white/70 bg-white/80 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#117a98] shadow-sm">
                                    <Icon icon={item.icon} width={18} />
                                </div>
                                <p className="mt-3 text-sm font-semibold text-slate-800">
                                    {item.title}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {pages.map((page) => (
                        <MetaForm key={page.key} page={page} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
