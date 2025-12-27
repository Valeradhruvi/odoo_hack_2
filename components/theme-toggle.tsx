"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-16 h-8 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
    }

    const isDark = theme === "dark"

    return (
        <div className="flex items-center gap-3">
            <span className={cn("text-[10px] font-black uppercase tracking-widest transition-opacity", !isDark ? "text-indigo-600 opacity-100" : "text-zinc-500 opacity-40")}>Light</span>

            <button
                onClick={() => {
                    const next = isDark ? "light" : "dark"
                    console.log(`[ThemeToggle] Switching to: ${next}`)
                    setTheme(next)
                }}
                className={cn(
                    "relative w-14 h-7 rounded-full transition-all duration-500 p-1 flex items-center group",
                    isDark
                        ? "bg-slate-800 ring-1 ring-white/10 shadow-inner"
                        : "bg-zinc-200 ring-1 ring-black/5 shadow-inner"
                )}
                aria-label="Toggle theme"
            >
                {/* Sliding Knob */}
                <div
                    className={cn(
                        "absolute w-5 h-5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center shadow-lg",
                        isDark
                            ? "translate-x-7 bg-indigo-500 text-white rotate-0"
                            : "translate-x-0 bg-white text-orange-500 rotate-180"
                    )}
                >
                    {isDark ? <Moon size={12} fill="currentColor" /> : <Sun size={12} fill="currentColor" />}
                </div>

                {/* Background Icons */}
                <div className="flex justify-between w-full px-1 items-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <Sun size={10} className={cn(!isDark && "invisible")} />
                    <Moon size={10} className={cn(isDark && "invisible")} />
                </div>
            </button>

            <span className={cn("text-[10px] font-black uppercase tracking-widest transition-opacity", isDark ? "text-indigo-400 opacity-100" : "text-zinc-500 opacity-40")}>Dark</span>
        </div>
    )
}
