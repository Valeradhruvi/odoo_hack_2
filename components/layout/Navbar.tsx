"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";

// For now, I will use simple conditional rendering without complex shadcn dropdowns if I haven't created them yet.
// I'll create a simple responsive Navbar.

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center px-4 md:px-8">
                <Link href="/" className="text-lg font-bold tracking-tight">
                    GearGuard
                </Link>
                <div className="ml-auto flex items-center space-x-4">
                    {session ? (
                        <>
                            <Link href="/dashboard/kanban" className="hidden md:block text-sm font-medium hover:underline">
                                Dashboard
                            </Link>
                            <Link href="/equipment" className="hidden md:block text-sm font-medium hover:underline">
                                Equipment
                            </Link>
                            <Link href="/requests" className="hidden md:block text-sm font-medium hover:underline">
                                Requests
                            </Link>
                            <Link href="/teams" className="hidden md:block text-sm font-medium hover:underline">
                                Teams
                            </Link>
                            <Link href="/reports" className="hidden md:block text-sm font-medium hover:underline">
                                Reports
                            </Link>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium hidden sm:inline-block">
                                    {session.user?.name} ({session.user?.role})
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Log out</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav >
    );
}
