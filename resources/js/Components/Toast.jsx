import { useEffect, useState } from "react";

export default function Toast({ message, type = "success" }) {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 3500);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    return (
        <div
            className={`fixed top-6 right-6 z-50 transition-[opacity,transform] duration-180 ease-out will-change-[opacity,transform]
                ${visible ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[0.985]"}
            `}
        >
            <div className={`
                rounded-xl px-6 py-4 text-white shadow-lg
                ${type === "success" ? "bg-[#25A7CA]" : "bg-red-500"}
            `}>
                {message}
            </div>
        </div>
    );
}
