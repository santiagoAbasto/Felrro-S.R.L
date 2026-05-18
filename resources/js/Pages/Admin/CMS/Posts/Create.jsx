import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import PostForm from "./Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        category: { es: "", en: "" },
        title: { es: "", en: "" },
        excerpt: { es: "", en: "" },
        content: { es: "", en: "" },
        image: null,
        order: "",
        is_featured: false,
        is_active: true,
        published_at: "",
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.posts.store"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Nueva novedad" />
            <PostForm
                title="Nueva novedad"
                description="Creá una publicación para la sección de novedades del sitio."
                data={data}
                setData={setData}
                submit={submit}
                processing={processing}
                errors={errors}
                buttonText="Guardar novedad"
            />
        </AdminLayout>
    );
}
