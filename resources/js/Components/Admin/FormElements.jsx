import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";

export const panelInputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#25A7CA] focus:ring-4 focus:ring-[#25A7CA]/10";

export const panelTextareaClass =
    `${panelInputClass} min-h-[132px] resize-y`;

export function AdminPageHeader({ eyebrow, title, description, actions = null }) {
    return (
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
                {eyebrow ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#25A7CA]">
                        {eyebrow}
                    </p>
                ) : null}
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    {title}
                </h1>
                {description ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {description}
                    </p>
                ) : null}
            </div>

            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
    );
}

export function AdminSectionCard({ title, description, children, tone = "default" }) {
    const toneClass = {
        default: "border-slate-200 bg-white",
        accent: "border-[#25A7CA]/20 bg-[#25A7CA]/[0.03]",
        soft: "border-slate-200 bg-slate-50/70",
    }[tone] ?? "border-slate-200 bg-white";

    return (
        <section className={`rounded-[28px] border p-6 shadow-sm ${toneClass}`}>
            {(title || description) && (
                <div className="mb-6">
                    {title ? (
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    ) : null}
                    {description ? (
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                            {description}
                        </p>
                    ) : null}
                </div>
            )}
            <div className="space-y-6">{children}</div>
        </section>
    );
}

export function AdminField({ label, hint, error, children, optional = false }) {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-800">{label}</label>
                {optional ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Opcional
                    </span>
                ) : null}
            </div>
            {children}
            {hint ? <p className="mt-2 text-xs leading-relaxed text-slate-400">{hint}</p> : null}
            {error ? <p className="mt-2 text-xs font-medium text-red-500">{error}</p> : null}
        </div>
    );
}

export function AdminTextInput({
    label,
    value,
    onChange,
    placeholder,
    hint,
    error,
    type = "text",
    optional = false,
    maxLength,
}) {
    return (
        <AdminField label={label} hint={hint} error={error} optional={optional}>
            <input
                type={type}
                value={value ?? ""}
                maxLength={maxLength}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={panelInputClass}
            />
            {maxLength ? (
                <div className="mt-2 text-right text-xs text-slate-300">
                    {(value ?? "").length}/{maxLength}
                </div>
            ) : null}
        </AdminField>
    );
}

export function AdminTextarea({
    label,
    value,
    onChange,
    placeholder,
    hint,
    error,
    rows = 5,
    optional = false,
    maxLength,
}) {
    return (
        <AdminField label={label} hint={hint} error={error} optional={optional}>
            <textarea
                rows={rows}
                value={value ?? ""}
                maxLength={maxLength}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={panelTextareaClass}
            />
            {maxLength ? (
                <div className="mt-2 text-right text-xs text-slate-300">
                    {(value ?? "").length}/{maxLength}
                </div>
            ) : null}
        </AdminField>
    );
}

export function AdminRichTextarea({
    label,
    value,
    onChange,
    placeholder,
    hint,
    error,
    rows = 7,
    optional = false,
    maxLength,
    previewTitle = "Vista previa",
}) {
    const textareaRef = useRef(null);

    const insertAtCursor = (before, after = "") => {
        const textarea = textareaRef.current;
        const currentValue = value ?? "";

        if (!textarea) {
            onChange(`${currentValue}${before}${after}`);
            return;
        }

        const start = textarea.selectionStart ?? currentValue.length;
        const end = textarea.selectionEnd ?? currentValue.length;
        const selectedText = currentValue.slice(start, end);
        const nextValue =
            currentValue.slice(0, start) +
            before +
            selectedText +
            after +
            currentValue.slice(end);

        onChange(nextValue);

        requestAnimationFrame(() => {
            textarea.focus();
            const caret = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(caret, caret);
        });
    };

    const previewLines = useMemo(
        () =>
            (value ?? "")
                .split("\n")
                .map((line) => line.trimEnd())
                .filter((line, index, arr) => line.length > 0 || (index > 0 && arr[index - 1].length > 0)),
        [value]
    );

    return (
        <AdminField label={label} hint={hint} error={error} optional={optional}>
            <div className="rounded-[24px] border border-slate-200 bg-white">
                <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3">
                    {[
                        {
                            label: "Nuevo párrafo",
                            icon: "solar:text-bold",
                            action: () => insertAtCursor("\n\n"),
                        },
                        {
                            label: "Lista",
                            icon: "solar:list-down-outline",
                            action: () => insertAtCursor("\n• "),
                        },
                        {
                            label: "Separar ideas",
                            icon: "solar:sort-by-time-outline",
                            action: () => insertAtCursor("\n- "),
                        },
                    ].map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={item.action}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#25A7CA]/30 hover:bg-[#25A7CA]/5 hover:text-[#117a98]"
                        >
                            <Icon icon={item.icon} width={14} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <textarea
                    ref={textareaRef}
                    rows={rows}
                    value={value ?? ""}
                    maxLength={maxLength}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="min-h-[180px] w-full resize-y rounded-b-[24px] border-0 px-4 py-4 text-sm leading-relaxed text-slate-800 outline-none"
                />
            </div>

            {maxLength ? (
                <div className="mt-2 text-right text-xs text-slate-300">
                    {(value ?? "").length}/{maxLength}
                </div>
            ) : null}

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {previewTitle}
                </p>

                {previewLines.length > 0 ? (
                    <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                        {previewLines.map((line, index) => (
                            <p key={`${line}-${index}`}>{line}</p>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-slate-400">
                        La vista previa se completa a medida que escribís.
                    </p>
                )}
            </div>
        </AdminField>
    );
}

export function AdminToggle({
    label,
    hint,
    checked,
    onChange,
    activeText = "Visible",
    inactiveText = "Oculto",
}) {
    return (
        <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
            </div>

            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
            >
                <span
                    className={`h-2.5 w-2.5 rounded-full ${
                        checked ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                />
                {checked ? activeText : inactiveText}
            </button>
        </div>
    );
}

export function AdminFileField({
    label,
    value,
    onChange,
    accept,
    error,
    hint,
    optional = false,
    maxSizeMB,
    currentUrl = null,
    currentLabel = null,
    previewUrl = null,
    kind = "image",
    buttonLabel = "Seleccionar archivo",
}) {
    const inputRef = useRef(null);
    const [localError, setLocalError] = useState("");
    const [previewDataUrl, setPreviewDataUrl] = useState(null);
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!(value instanceof File)) {
            setPreviewDataUrl(null);
            setObjectUrl(null);
            return undefined;
        }

        if (kind === "image") {
            const reader = new FileReader();

            reader.onload = () => {
                setPreviewDataUrl(typeof reader.result === "string" ? reader.result : null);
            };

            reader.onerror = () => {
                setPreviewDataUrl(null);
            };

            reader.readAsDataURL(value);

            return undefined;
        }

        const nextObjectUrl = URL.createObjectURL(value);
        setObjectUrl(nextObjectUrl);

        return () => URL.revokeObjectURL(nextObjectUrl);
    }, [value, kind]);

    const effectivePreview = previewDataUrl || objectUrl || previewUrl || currentUrl;

    const handleChange = (event) => {
        const nextFile = event.target.files?.[0] ?? null;

        if (!nextFile) {
            return;
        }

        if (maxSizeMB && nextFile.size > maxSizeMB * 1024 * 1024) {
            setLocalError(`El archivo supera el máximo permitido de ${maxSizeMB} MB.`);
            event.target.value = "";
            return;
        }

        setLocalError("");
        onChange(nextFile);
    };

    const clearSelection = () => {
        setLocalError("");
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <AdminField
            label={label}
            hint={hint || (maxSizeMB ? `Tamaño máximo sugerido: ${maxSizeMB} MB.` : undefined)}
            error={error || localError}
            optional={optional}
        >
            <div className="space-y-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
                {effectivePreview ? (
                    <FilePreview kind={kind} url={effectivePreview} />
                ) : null}

                {currentLabel && !value ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                        {currentLabel}
                    </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#25A7CA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d96b8]"
                    >
                        <Icon icon="solar:upload-outline" width={16} />
                        {buttonLabel}
                    </button>

                    {value || effectivePreview ? (
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white"
                        >
                            Quitar selección
                        </button>
                    ) : null}

                    <span className="text-xs text-slate-400">
                        {value instanceof File ? value.name : accept ? `Formatos admitidos: ${accept}` : ""}
                    </span>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />
            </div>
        </AdminField>
    );
}

function FilePreview({ kind, url }) {
    if (kind === "video") {
        return (
            <video
                src={url}
                controls
                className="max-h-72 w-full rounded-[20px] border border-slate-200 bg-black object-contain"
            />
        );
    }

    if (kind === "document") {
        return (
            <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25A7CA]/10 text-[#117a98]">
                        <Icon icon="solar:document-text-outline" width={20} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Archivo listo para revisar</p>
                        <p className="text-xs text-slate-400">Podés abrirlo para confirmar que sea el documento correcto.</p>
                    </div>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Abrir
                </a>
            </div>
        );
    }

    return <ImagePreview url={url} />;
}

function ImagePreview({ url }) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (hasError || !url) {
        return (
            <div className="flex min-h-[180px] w-full items-center justify-center rounded-[20px] border border-slate-200 bg-white px-4 py-10 text-center">
                <div>
                    <p className="text-sm font-semibold text-slate-600">Vista previa no disponible</p>
                    <p className="mt-1 text-xs text-slate-400">
                        Elegí otra imagen para revisar cómo quedará antes de guardar.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt="Vista previa"
            onError={() => setHasError(true)}
            className="max-h-72 w-full rounded-[20px] border border-slate-200 bg-white object-contain"
        />
    );
}
