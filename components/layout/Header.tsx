import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Fallback initials
    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <header className="h-20 glass sticky top-0 z-40 px-10 flex items-center justify-between border-b border-zinc-200/30 dark:border-white/5 backdrop-blur-2xl">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                <div className="relative w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 group-focus-within:scale-110 transition-all duration-300" size={18} />
                    <input
                        type="text"
                        placeholder="Universal search: Requests, Assets, Teams..."
                        className="w-full bg-zinc-200/30 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 rounded-[20px] py-3 pl-14 pr-6 text-sm font-medium focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-zinc-500"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 group-focus-within:opacity-100 transition-opacity">
                        <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-white/10 text-[10px] font-black font-mono">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-white/10 text-[10px] font-black font-mono">K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button className="p-3 rounded-2xl hover:bg-white dark:hover:bg-white/5 text-zinc-500 hover:text-indigo-500 transition-all relative group shadow-sm hover:shadow-md">
                        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />
                    </button>
                </div>

                <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-zinc-200 dark:via-white/10 to-transparent" />

                <div className="flex items-center gap-4 pl-2 group cursor-pointer bg-transparent hover:bg-white/5 p-1.5 rounded-2xl transition-all">
                    <div className="flex flex-col text-right">
                        <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors tracking-tight">
                            {user?.name || 'Guest User'}
                        </span>
                        <span className="text-[10px] font-black text-indigo-600/60 dark:text-indigo-400/60 uppercase tracking-[0.2em]">
                            {user?.role || 'Visitor'}
                        </span>
                    </div>
                    <div className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-500/30 ring-2 ring-white dark:ring-slate-900 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
}
