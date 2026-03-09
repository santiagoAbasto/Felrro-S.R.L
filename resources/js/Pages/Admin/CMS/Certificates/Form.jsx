import { useEffect, useState } from "react";

export default function Form({
    data,
    setData,
    errors,
    processing,
    submit,
    existingFile = null,
    existingLogo = null,
    buttonText = "Guardar"
}) {

    const [logoPreview, setLogoPreview] = useState(existingLogo);
    const [fileName, setFileName] = useState(null);
    const [fileSize, setFileSize] = useState(null);

    /* ================= LOGO PREVIEW ================= */

    useEffect(() => {
        setLogoPreview(existingLogo);
    }, [existingLogo]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData("image_logo", file);
        setLogoPreview(URL.createObjectURL(file));
    };

    /* ================= FILE HANDLER ================= */

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData("file", file);

        setFileName(file.name);

        const sizeKB = (file.size / 1024).toFixed(0);
        setFileSize(`${sizeKB} KB`);

        setData("format", file.type.includes("pdf") ? "PDF" : "");
        setData("weight", `${sizeKB} KB`);
    };

    /* ================= ORDER UPPERCASE ================= */

    const handleOrderChange = (e) => {
        setData("order", e.target.value.toUpperCase());
    };

    const inputStyle =
        "w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#25A7CA]/30 focus:border-[#25A7CA]";

    const sectionStyle =
        "bg-white p-10 rounded-xl border border-gray-200 shadow-sm space-y-8";

    return (
        <form onSubmit={submit} className="space-y-12">

            {/* =======================================================
               INFORMACIÓN GENERAL
            ======================================================= */}

            <div className={sectionStyle}>

                <h2 className="text-xl font-semibold text-gray-900">
                    Información del Certificado
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre (ES)
                        </label>
                        <input
                            type="text"
                            autoComplete="off"
                            value={data.name.es}
                            onChange={e =>
                                setData("name", { ...data.name, es: e.target.value })
                            }
                            className={inputStyle}
                        />
                        {errors["name.es"] && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors["name.es"]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre (EN)
                        </label>
                        <input
                            type="text"
                            autoComplete="off"
                            value={data.name.en}
                            onChange={e =>
                                setData("name", { ...data.name, en: e.target.value })
                            }
                            className={inputStyle}
                        />
                        {errors["name.en"] && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors["name.en"]}
                            </p>
                        )}
                    </div>

                </div>

                {/* ORDEN */}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Orden (Sistema tipo Excel)
                    </label>

                    <input
                        type="text"
                        value={data.order}
                        onChange={handleOrderChange}
                        className={`${inputStyle} uppercase tracking-widest`}
                        placeholder="Ej: A, AA, AB..."
                        maxLength={5}
                    />

                    {errors.order && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.order}
                        </p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                        Se ordena alfabéticamente (A → AA → AB → B...)
                    </p>
                </div>

            </div>


            {/* =======================================================
               DOCUMENTO PDF
            ======================================================= */}

            <div className={sectionStyle}>

                <h2 className="text-xl font-semibold text-gray-900">
                    Documento PDF
                </h2>

                {existingFile && !data.file && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                            Archivo actual
                        </span>
                        <a
                            href={`/storage/${existingFile}`}
                            target="_blank"
                            className="text-[#25A7CA] font-medium hover:underline"
                        >
                            Ver documento
                        </a>
                    </div>
                )}

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className={inputStyle}
                />

                {fileName && (
                    <div className="text-sm text-gray-600">
                        <strong>{fileName}</strong>
                        {fileSize && <span> • {fileSize}</span>}
                    </div>
                )}

                <p className="text-xs text-gray-500">
                    Solo archivos PDF. Máximo 15MB.
                </p>

                {errors.file && (
                    <p className="text-xs text-red-500">
                        {errors.file}
                    </p>
                )}

            </div>


            {/* =======================================================
               LOGO
            ======================================================= */}

            <div className={sectionStyle}>

                <h2 className="text-xl font-semibold text-gray-900">
                    Logo del Certificado (Opcional)
                </h2>

                {logoPreview && (
                    <div className="flex items-center gap-6">
                        <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-32 h-20 object-contain bg-gray-50 p-3 rounded-lg border border-gray-200"
                        />
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className={inputStyle}
                />

                {errors.image_logo && (
                    <p className="text-xs text-red-500">
                        {errors.image_logo}
                    </p>
                )}

            </div>


            {/* =======================================================
               INFORMACIÓN TÉCNICA
            ======================================================= */}

            <div className={sectionStyle}>

                <h2 className="text-xl font-semibold text-gray-900">
                    Información Técnica
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Formato
                        </label>
                        <input
                            type="text"
                            value={data.format || ""}
                            onChange={e => setData("format", e.target.value)}
                            className={inputStyle}
                            placeholder="PDF"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Peso
                        </label>
                        <input
                            type="text"
                            value={data.weight || ""}
                            onChange={e => setData("weight", e.target.value)}
                            className={inputStyle}
                            placeholder="Ej: 340 KB"
                        />
                    </div>

                </div>

            </div>


            {/* =======================================================
               ACTIVO
            ======================================================= */}

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={e => setData("is_active", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-[#25A7CA]"
                />
                <span className="text-sm font-medium text-gray-700">
                    Certificado activo
                </span>
            </div>


            {/* =======================================================
               BOTÓN
            ======================================================= */}

            <div>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center px-6 h-11 rounded-lg bg-[#25A7CA] text-white text-sm font-semibold transition hover:bg-[#1F8EA8] disabled:opacity-50"
                >
                    {processing ? "Guardando..." : buttonText}
                </button>
            </div>

        </form>
    );
}