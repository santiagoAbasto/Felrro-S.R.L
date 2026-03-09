import Card from "./Card";
import { Icon } from "@iconify/react";

export default function StatCard({ title, value, icon }) {
    return (
        <Card className="flex items-center justify-between p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all">

            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                    {title}
                </p>

                <h3 className="text-3xl font-semibold text-[#111827] mt-2">
                    {value}
                </h3>
            </div>

            <div className="w-14 h-14 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#1E40AF]">
                <Icon icon={icon} width={24} />
            </div>

        </Card>
    );
}