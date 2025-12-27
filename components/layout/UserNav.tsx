"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";

interface UserNavProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    };
    initials: string;
}

export function UserNav({ user, initials }: UserNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 pl-2 group cursor-pointer bg-transparent hover:bg-white/5 p-1.5 rounded-2xl transition-all focus:outline-none"
            >
                <div className="flex flex-col text-right">
                    <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors tracking-tight">
                        {user.name || 'Guest User'}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600/60 dark:text-indigo-400/60 uppercase tracking-[0.2em]">
                        {user.role || 'Visitor'}
                    </span>
                </div>
                <div className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-500/30 ring-2 ring-white dark:ring-slate-900 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 relative">
                    {user.image ? (
                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover rounded-[18px]" />
                    ) : (
                        initials
                    )}
                    <div className={`absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5 border border-zinc-200 dark:border-zinc-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-indigo-500/10 border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <User size={16} />
                        Profile
                    </Link>

                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-not-allowed opacity-50"
                        disabled
                    >
                        <Settings size={16} />
                        Settings
                    </button>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={16} />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
