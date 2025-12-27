'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    Settings,
    LogOut,
    Wrench,
    Users,
    ChevronLeft,
    Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Kanban Board', href: '/dashboard/kanban', icon: LayoutDashboard },
    { name: 'Maintenance Calendar', href: '/requests/calendar', icon: Calendar },
    { name: 'Analytics & Reports', href: '/reports', icon: BarChart3 },
    { name: 'Equipment Pool', href: '#', icon: Box },
    { name: 'Teams & Technicians', href: '#', icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside
            className={cn(
                "h-screen glass sticky top-0 flex flex-col transition-all duration-500 ease-in-out border-r z-50",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 relative overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 shrink-0">
                        <Wrench className="text-white" size={24} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-gradient">GearGuard</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Maintenance Pro</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-indigo-600 shadow-xl shadow-indigo-500/20 text-white font-bold"
                                    : "text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-white/5 hover:text-indigo-500 hover:shadow-lg hover:shadow-black/5"
                            )}
                        >
                            <item.icon className={cn(
                                "transition-all duration-300 shrink-0",
                                isActive ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:-rotate-3"
                            )} size={18} />
                            {!isCollapsed && (
                                <span className="text-[13px] font-bold tracking-tight truncate">{item.name}</span>
                            )}
                            {isActive && (
                                <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 space-y-3">
                {!isCollapsed && (
                    <div className="px-5 py-6 rounded-[24px] bg-gradient-to-br from-indigo-700 to-purple-800 text-white shadow-2xl shadow-indigo-500/20 mb-6 overflow-hidden relative group border border-white/10">
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Settings size={20} className="animate-spin-slow" />
                            </div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-1">Infrastructure</p>
                            <p className="font-black text-sm mb-4 leading-tight">Master Admin Control</p>
                            <button className="w-full bg-white text-indigo-700 text-[11px] font-black py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 uppercase tracking-widest">
                                Configure System
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                    </div>
                )}

                <button className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-600 transition-all duration-300 group font-bold tracking-tight text-[13px]">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    {!isCollapsed && <span>Sign Out System</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-50 text-zinc-500"
            >
                <ChevronLeft className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} size={14} />
            </button>
        </aside>
    );
}
