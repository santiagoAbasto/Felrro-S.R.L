import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useMemo } from "react";

export default function Edit({ page }) {

    const banner = useMemo(
        () => page.sections.find(s => s.type === "contact_banner"),
        [page]
    );

    const info = useMemo(
        () => page.sections.find(s => s.type === "contact_info"),
        [page]
    );

    const map = useMemo(
        () => page.sections.find(s => s.type === "contact_map"),
        [page]
    );

    /*
    |--------------------------------------------------------------------------
    | 🔥 NORMALIZACIÓN SEGURA (ANTI-NULL)
    |--------------------------------------------------------------------------
    */

    const { data, setData, put, processing } = useForm({
        banner: {
            title: {
                es: banner?.title?.es ?? "",
                en: banner?.title?.en ?? "",
            },
            subtitle: {
                es: banner?.subtitle?.es ?? "",
                en: banner?.subtitle?.en ?? "",
            },
            is_active: banner?.is_active ?? true,
        },

        info: {
            address: {
                es: info?.content?.address?.es ?? "",
                en: info?.content?.address?.en ?? "",
            },
            phone: info?.content?.phone ?? "",
            email: info?.content?.email ?? "",
            schedule: {
                es: info?.content?.schedule?.es ?? "",
                en: info?.content?.schedule?.en ?? "",
            },
            is_active: info?.is_active ?? true,
        },

        map: {
            iframe: info?.content?.iframe ?? map?.content?.iframe ?? "",
            is_active: map?.is_active ?? true,
        },
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.contacto.update"));
    };

    /* ── estilos ── */
    const cardClass   = "bg-white rounded-xl shadow-sm overflow-hidden mb-8";
    const headerClass = "px-6 py-4 border-b border-[#DDDDE0]";
    const bodyClass   = "p-6";
    const labelClass  = "block text-sm font-semibold text-[#101010] mb-2";
    const inputClass  = "w-full px-4 py-3 rounded-lg border border-[#D9D9D9] bg-white text-[#101010] text-sm outline-none focus:border-[#25A7CA] transition-colors";

    const Toggle = ({ checked, onChange }) => (
        <div
            className="flex items-center gap-3 cursor-pointer select-none mt-2"
            onClick={() => onChange(!checked)}
        >
            <div className={"w-10 h-6 rounded-full transition-colors relative " + (checked ? "bg-[#25A7CA]" : "bg-[#D9D9D9]")}>
                <div className={"absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform " + (checked ? "translate-x-5" : "translate-x-1")} />
            </div>
            <span className="text-sm font-medium text-[#101010]">
                {checked ? "Activo" : "Inactivo"}
            </span>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Editar Contacto" />

            <div className="p-8 min-h-screen bg-gray-50 font-[Montserrat]">

                <h1 className="text-3xl font-bold text-[#101010] mb-8">
                    CMS — Página Contacto
                </h1>

                <form onSubmit={submit}>

                    {/* ═════════ BANNER ═════════ */}
                    <div className={cardClass}>
                        <div className={headerClass}>
                            <h2 className="text-base font-bold text-[#101010]">Banner</h2>
                        </div>
                        <div className={bodyClass}>

                            <div className="grid grid-cols-2 gap-6">

                                <div>
                                    <label className={labelClass}>Título ES</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={data.banner.title.es}
                                        onChange={e =>
                                            setData("banner", {
                                                ...data.banner,
                                                title: { ...data.banner.title, es: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Title EN</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={data.banner.title.en}
                                        onChange={e =>
                                            setData("banner", {
                                                ...data.banner,
                                                title: { ...data.banner.title, en: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Subtítulo ES</label>
                                    <textarea
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                        value={data.banner.subtitle.es}
                                        onChange={e =>
                                            setData("banner", {
                                                ...data.banner,
                                                subtitle: { ...data.banner.subtitle, es: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Subtitle EN</label>
                                    <textarea
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                        value={data.banner.subtitle.en}
                                        onChange={e =>
                                            setData("banner", {
                                                ...data.banner,
                                                subtitle: { ...data.banner.subtitle, en: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                            </div>

                            <Toggle
                                checked={data.banner.is_active}
                                onChange={v =>
                                    setData("banner", { ...data.banner, is_active: v })
                                }
                            />
                        </div>
                    </div>

                    {/* ═════════ INFO ═════════ */}
                    <div className={cardClass}>
                        <div className={headerClass}>
                            <h2 className="text-base font-bold text-[#101010]">
                                Información de Contacto
                            </h2>
                        </div>
                        <div className={bodyClass}>

                            <div className="grid grid-cols-2 gap-6">

                                <div>
                                    <label className={labelClass}>Dirección ES</label>
                                    <textarea
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                        value={data.info.address.es}
                                        onChange={e =>
                                            setData("info", {
                                                ...data.info,
                                                address: { ...data.info.address, es: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Address EN</label>
                                    <textarea
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                        value={data.info.address.en}
                                        onChange={e =>
                                            setData("info", {
                                                ...data.info,
                                                address: { ...data.info.address, en: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Teléfono</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={data.info.phone}
                                        onChange={e =>
                                            setData("info", { ...data.info, phone: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        className={inputClass}
                                        value={data.info.email}
                                        onChange={e =>
                                            setData("info", { ...data.info, email: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Horario ES</label>
                                    <textarea
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                        value={data.info.schedule.es}
                                        onChange={e =>
                                            setData("info", {
                                                ...data.info,
                                                schedule: { ...data.info.schedule, es: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Schedule EN</label>
                                    <textarea
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                        value={data.info.schedule.en}
                                        onChange={e =>
                                            setData("info", {
                                                ...data.info,
                                                schedule: { ...data.info.schedule, en: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                            </div>

                            <Toggle
                                checked={data.info.is_active}
                                onChange={v =>
                                    setData("info", { ...data.info, is_active: v })
                                }
                            />
                        </div>
                    </div>

                    {/* ═════════ MAPA ═════════ */}
                    <div className={cardClass}>
                        <div className={headerClass}>
                            <h2 className="text-base font-bold text-[#101010]">
                                Mapa (Iframe)
                            </h2>
                        </div>
                        <div className={bodyClass}>

                            <textarea
                                rows={5}
                                className={inputClass + " resize-none font-mono text-xs"}
                                value={data.map.iframe}
                                onChange={e =>
                                    setData("map", { ...data.map, iframe: e.target.value })
                                }
                                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                            />

                            {data.map.iframe && (
                                <div className="mt-6">
                                    <p className="text-sm font-semibold mb-3">Vista previa</p>
                                    <div
                                        className="w-full rounded-xl overflow-hidden border border-[#DDDDE0]"
                                        style={{ height: 360 }}
                                        dangerouslySetInnerHTML={{ __html: data.map.iframe }}
                                    />
                                </div>
                            )}

                            <Toggle
                                checked={data.map.is_active}
                                onChange={v =>
                                    setData("map", { ...data.map, is_active: v })
                                }
                            />
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex px-8 py-3 rounded-full bg-[#25A7CA] hover:bg-[#1f93b3] text-white text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}