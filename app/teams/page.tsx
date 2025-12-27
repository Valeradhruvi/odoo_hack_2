import { prisma } from "@/lib/prisma";
import { Mail, Users, Briefcase, Wrench } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true, id: true }
    });

    if (!currentUser) redirect("/login");

    // FILTER LOGIC
    if (currentUser.role === 'REQUESTER') {
        // Requesters only see technicians assigned to THEIR requests
        const techIds = await prisma.maintenanceRequest.findMany({
            where: {
                createdById: currentUser.id,
                assignedTechnicianId: { not: null }
            },
            select: { assignedTechnicianId: true },
            distinct: ['assignedTechnicianId']
        });

        const ids = techIds.map(t => t.assignedTechnicianId).filter(Boolean) as number[];

        const myTechnicians = await prisma.user.findMany({
            where: { id: { in: ids } },
            include: {
                teams: true,
                _count: {
                    select: { assignedRequests: { where: { status: { not: 'SCRAP' } } } }
                }
            }
        });

        return {
            teams: [], // Requesters don't see teams
            allTechnicians: myTechnicians,
            isRequester: true
        };
    }

    // ADMIN / TECHNICIAN: See everything
    const teams = await prisma.maintenanceTeam.findMany({
        include: {
            technicians: true,
            equipments: true,
        },
    });

    const allTechnicians = await prisma.user.findMany({
        where: { role: 'TECHNICIAN' },
        include: {
            teams: true,
            _count: {
                select: { assignedRequests: { where: { status: { not: 'SCRAP' } } } }
            }
        }
    });

    return { teams, allTechnicians, isRequester: false };
}

export default async function TeamsPage() {
    const { teams, allTechnicians, isRequester } = await getData();

    return (
        <div className="container mx-auto py-10 px-4 space-y-12 pb-20">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2">
                    {isRequester ? 'My Technicians' : 'Teams & Technicians'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    {isRequester
                        ? 'View contact details for technicians assigned to your requests.'
                        : 'Manage your workforce, view rosters, and track team allocations.'}
                </p>
            </div>

            {/* Technicians Roster Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Users size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                            {isRequester ? 'Assigned Agents' : 'Technician Roster'}
                        </h2>
                        <p className="text-sm text-zinc-500">
                            {isRequester ? 'Technicians currently handling your tickets.' : 'All available field agents and their status.'}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {allTechnicians.length > 0 ? (
                        allTechnicians.map((tech) => (
                            <div key={tech.id} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Wrench size={64} className="text-indigo-500 rotate-12" />
                                </div>

                                <div className="flex items-start gap-4 mb-4 relative">
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-4 ring-white dark:ring-zinc-900 shadow-lg">
                                        {tech.image ? (
                                            <img src={tech.image} alt={tech.name || "User"} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-black text-zinc-300 dark:text-zinc-600">
                                                {tech.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{tech.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mt-0.5">
                                            <Mail size={12} />
                                            <span className="truncate max-w-[120px]">{tech.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 relative">
                                    {!isRequester && (
                                        <div className="flex items-center justify-between text-xs py-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <span className="text-zinc-500 font-medium">Active Tasks</span>
                                            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-bold">
                                                {tech._count.assignedRequests}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {tech.teams.map(team => (
                                            <span key={team.id} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                {team.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-zinc-400 italic bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            {isRequester
                                ? 'No technicians have been assigned to your requests yet.'
                                : 'No technicians found in the system.'}
                        </div>
                    )}
                </div>
            </section>

            {/* Existing Teams Section (Styled) - HIDDEN FOR REQUESTERS */}
            {!isRequester && (
                <section className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Maintenance Teams</h2>
                            <p className="text-sm text-zinc-500">Organized groups and their equipment responsibilities.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team) => (
                            <div key={team.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{team.name}</h3>
                                    <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                                        Details
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Team Members</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {team.technicians.map((tech) => (
                                                <div key={tech.id} className="flex items-center gap-2 pl-1 pr-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-full border border-zinc-100 dark:border-zinc-700">
                                                    <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                                        {tech.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{tech.name}</span>
                                                </div>
                                            ))}
                                            {team.technicians.length === 0 && <span className="text-xs text-zinc-400 italic">No members</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Responsibility</h4>
                                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                            <Wrench size={16} />
                                            <span className="font-bold text-zinc-900 dark:text-white">{team.equipments.length}</span>
                                            <span>Assets Assigned</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {teams.length === 0 && (
                            <div className="col-span-full py-12 text-center text-zinc-400 italic">
                                No maintenance teams created.
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
