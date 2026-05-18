import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import PostForm from "./Form";

export default function Edit({ post }) {
    const { data, setData, post: submitPost, processing, errors } = useForm({
        _method: "put",
        category: post.category || { es: "", en: "" },
        title: post.title || { es: "", en: "" },
        excerpt: post.excerpt || { es: "", en: "" },
        content: post.content || { es: "", en: "" },
        image: null,
        existing_image: post.image_url || null,
        order: post.order || "",
        is_featured: Boolean(post.is_featured),
        is_active: Boolean(post.is_active),
        published_at: post.published_at ? String(post.published_at).slice(0, 10) : "",
    });

    const submit = (event) => {
        event.preventDefault();

        submitPost(route("admin.posts.update", post.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar novedad" />
            <PostForm
                title="Editar novedad"
                description="Actualizá el contenido, imagen y estado de publicación."
                data={data}
                setData={setData}
                submit={submit}
                processing={processing}
                errors={errors}
                buttonText="Guardar cambios"
            />
        </AdminLayout>
    );
}
