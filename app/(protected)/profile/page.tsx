import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
    User,
    Mail,
    Calendar,
    Shield,
    Wrench,
    Clock,
    CheckCircle,
    AlertTriangle,
    FileText
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            assignedRequests: {
                where: { status: { not: 'SCRAP' } },
                orderBy: { updatedAt: 'desc' },
                take: 5
            },
            createdRequests: {
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            equipmentOwned: true,
            _count: {
                select: {
                    assignedRequests: true,
                    createdRequests: true,
                    equipmentOwned: true
                }
            }
        }
    });

    if (!user) {
        return <div>User not found</div>;
    }

    const initials = user.name
        ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-[32px] bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/30 ring-4 ring-white dark:ring-zinc-900 shrink-0">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-[32px]" />
                        ) : (
                            initials
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                                    {user.name}
                                </h1>
                                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-500/30">
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                            {user.role === 'TECHNICIAN' && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                    <Wrench size={16} className="text-indigo-500" />
                                    <span className="font-bold text-zinc-700 dark:text-zinc-200">{user._count.assignedRequests}</span>
                                    <span className="text-xs text-zinc-400 font-bold uppercase">Tasks</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                <FileText size={16} className="text-purple-500" />
                                <span className="font-bold text-zinc-700 dark:text-zinc-200">{user._count.createdRequests}</span>
                                <span className="text-xs text-zinc-400 font-bold uppercase">Requests</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                                <Shield size={16} className="text-emerald-500" />
                                <span className="font-bold text-zinc-700 dark:text-zinc-200">{user._count.equipmentOwned}</span>
                                <span className="text-xs text-zinc-400 font-bold uppercase">Assets</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Specific Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* TECHNICIAN VIEW: Assigned Tasks */}
                {user.role === 'TECHNICIAN' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Assigned Tasks</h2>
                            <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black px-2 py-1 rounded-md">
                                {user.assignedRequests.length} Active
                            </span>
                        </div>
                        <div className="space-y-3">
                            {user.assignedRequests.length > 0 ? (
                                user.assignedRequests.map(req => (
                                    <div key={req.id} className="group p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${req.type === 'CORRECTIVE'
                                                    ? 'bg-orange-500/10 text-orange-600'
                                                    : 'bg-emerald-500/10 text-emerald-600'
                                                }`}>
                                                {req.type === 'CORRECTIVE' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors">
                                                    {req.subject}
                                                </h3>
                                                <p className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                                                    <Clock size={12} />
                                                    Due: {new Date(req.scheduledDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${req.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                req.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                                                    req.status === 'REPAIRED' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {req.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-zinc-400 italic bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                    No active tasks assigned.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MY REQUESTS (Visible to Everyone) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Requests</h2>
                        <span className="bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 text-xs font-black px-2 py-1 rounded-md">
                            Last 5
                        </span>
                    </div>
                    <div className="space-y-3">
                        {user.createdRequests.length > 0 ? (
                            user.createdRequests.map(req => (
                                <div key={req.id} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                                {req.subject}
                                            </h3>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${req.status === 'REPAIRED' ? 'text-emerald-500' : 'text-zinc-400'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-zinc-400 italic bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                No requests created yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
