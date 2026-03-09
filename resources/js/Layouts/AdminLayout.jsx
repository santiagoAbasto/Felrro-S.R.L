import Sidebar from "@/Components/Admin/Sidebar";
import Header from "@/Components/Admin/Header";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";

export default function AdminLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { flash } = usePage().props;

    return (
        <div className="flex h-screen bg-[#F3F4F6] font-sans text-[#111827]">

            {/* TOAST GLOBAL */}
            <Toast message={flash.success} type="success" />

            {/* SIDEBAR */}
            <div
                className={`
                    ${sidebarOpen ? "w-64" : "w-20"}
                    transition-all duration-300
                    hidden md:block
                    bg-white
                    border-r border-[#E5E7EB]
                `}
            >
                <Sidebar collapsed={!sidebarOpen} />
            </div>

            {/* MAIN */}
            <div className="flex flex-col flex-1 min-w-0">

                <Header />

                <main className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-[1500px] mx-auto space-y-10">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}