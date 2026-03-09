import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Toast from "@/Components/Toast";

export default function Send() {

    const { flash } = usePage().props;

    const { data, setData, post, processing } = useForm({
        subject: '',
        message: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.newsletter.store'));
    };

    return (
        <AdminLayout>
            <Head title="Enviar Newsletter" />

            {/* TOAST */}
            <Toast message={flash.success} type="success" />

            <div className="p-10 space-y-8 max-w-3xl">

                <h1 className="text-2xl font-bold">
                    Enviar Newsletter
                </h1>

                <form onSubmit={submit} className="space-y-6 bg-white p-8 rounded-xl shadow">

                    <div>
                        <label className="block mb-2 font-medium">
                            Asunto
                        </label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={e => setData('subject', e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Contenido
                        </label>
                        <textarea
                            rows="8"
                            value={data.message}
                            onChange={e => setData('message', e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#25A7CA] outline-none"
                        />
                    </div>

                    <button
                        disabled={processing}
                        className="bg-[#25A7CA] hover:bg-[#1f95b3] text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {processing ? "Enviando..." : "Enviar a todos los suscriptores"}
                    </button>

                </form>

            </div>
        </AdminLayout>
    );
}