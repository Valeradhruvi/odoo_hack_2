"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Wrench,
    AlertCircle,
    Clock,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
    stats: {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
    } | null;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const items = [
        {
            name: "Total Requests",
            value: stats?.total ?? 0,
            icon: Wrench,
            color: "text-indigo-600",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
        },
        {
            name: "New Requests",
            value: stats?.pending ?? 0,
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
        },
        {
            name: "In Progress",
            value: stats?.inProgress ?? 0,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
        },
        {
            name: "Completed",
            value: stats?.completed ?? 0,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
                <Card key={item.name} className={cn(
                    "relative overflow-hidden border-none glass transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group",
                    item.border
                )}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                                    {item.name}
                                </p>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                                    {item.value}
                                </h3>
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-black/5",
                                item.bg,
                                item.color
                            )}>
                                <item.icon size={24} />
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className={cn(
                            "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
                            item.bg
                        )} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
