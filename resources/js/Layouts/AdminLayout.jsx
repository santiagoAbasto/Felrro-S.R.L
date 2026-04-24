import Sidebar from "@/Components/Admin/Sidebar";
import Header from "@/Components/Admin/Header";
import { usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";

export default function AdminLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">

            <Toast message={flash.success} type="success" />

            <div className="hidden xl:block">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <Header />

                <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-[1500px] space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
