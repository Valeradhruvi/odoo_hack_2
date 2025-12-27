
'use client';

import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { MaintenanceRequest } from '@/components/kanban/types';
import { cn } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface ReportsViewProps {
    requests: MaintenanceRequest[];
}

export function ReportsView({ requests }: ReportsViewProps) {

    // Aggregate by Team
    const teamData = useMemo(() => {
        const counts: Record<string, number> = {};
        requests.forEach(req => {
            const name = req.maintenanceTeam?.name || 'Unassigned';
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [requests]);

    // Aggregate by Equipment
    const equipmentData = useMemo(() => {
        const counts: Record<string, number> = {};
        requests.forEach(req => {
            const eqName = req.equipment?.name || req.equipmentId;
            counts[eqName] = (counts[eqName] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [requests]);

    // Status Distribution
    const statusData = useMemo(() => {
        const counts: Record<string, number> = {};
        requests.forEach(req => {
            counts[req.status] = (counts[req.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [requests]);

    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#10b981'];

    return (
        <div className="flex flex-col gap-8 h-full overflow-y-auto pr-2 pb-8 scrollbar-hide">
            {/* Page Header */}
            <div className="flex items-end justify-between px-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Operation Insights</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">Data-driven maintenance performance metrics.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                    Live Data Active
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Volume', value: requests.length, icon: BarChart3, color: 'indigo' },
                    { label: 'Preventive Actions', value: requests.filter(r => r.type === 'PREVENTIVE').length, icon: TrendingUp, color: 'emerald' },
                    { label: 'Corrective Needs', value: requests.filter(r => r.type === 'CORRECTIVE').length, icon: PieChartIcon, color: 'orange' }
                ].map((stat) => (
                    <div key={stat.label} className="glass p-6 rounded-[24px] flex items-center justify-between border-b-4 border-b-indigo-500/10 hover:border-b-indigo-500 transition-all group shadow-2xl shadow-indigo-500/5">
                        <div className="space-y-1">
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.15em]">{stat.label}</p>
                            <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter group-hover:scale-105 origin-left transition-transform">{stat.value}</h3>
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl shadow-lg ring-1 ring-black/5 transition-transform group-hover:rotate-12",
                            stat.color === 'indigo' ? "bg-indigo-500 text-white shadow-indigo-500/20" :
                                stat.color === 'emerald' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                                    "bg-orange-500 text-white shadow-orange-500/20"
                        )}>
                            <stat.icon size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[450px]">
                {/* Requests by Team */}
                <div className="glass p-8 rounded-[32px] flex flex-col shadow-2xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Resource Allocation</h3>
                            <p className="text-xs text-zinc-500 font-medium">Distribution across maintenance teams</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamData}>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} opacity={0.05} />
                                <XAxis dataKey="name" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis fontSize={10} fontWeight={700} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 8 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="value" fill="url(#colorBar)" radius={10} barSize={45}>
                                    <defs>
                                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Requests by Equipment */}
                <div className="glass p-8 rounded-[32px] flex flex-col shadow-2xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Equipment Demand</h3>
                            <p className="text-xs text-zinc-500 font-medium">Critical assets requiring attention</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={equipmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="6 6" horizontal={false} opacity={0.05} />
                                <XAxis type="number" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                                <YAxis dataKey="name" type="category" width={110} fontSize={9} fontWeight={800} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(236, 72, 153, 0.05)', radius: 8 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#ec4899" radius={10} barSize={22} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
