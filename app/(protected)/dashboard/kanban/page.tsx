import { KanbanBoard } from '@/components/kanban/Board';
import { prisma } from '@/lib/prisma';
import { MaintenanceRequest, Equipment, User, MaintenanceTeam } from '@/components/kanban/types';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // Ensure real-time data

export default async function KanbanPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
    });

    if (!currentUser) {
        redirect("/login");
    }

    const isRequester = currentUser.role === 'REQUESTER';

    // Prepare filter for requests
    const requestWhere = isRequester ? { createdById: currentUser.id } : {};

    const [requests, equipments, technicians, maintenanceTeams] = await Promise.all([
        prisma.maintenanceRequest.findMany({
            where: requestWhere,
            include: {
                equipment: true,
                assignedTechnician: true,
                createdBy: true,
                maintenanceTeam: true,
            },
            orderBy: {
                updatedAt: 'desc',
            }
        }),
        prisma.equipment.findMany(),
        prisma.user.findMany({
            where: { role: 'TECHNICIAN' }
        }),
        prisma.maintenanceTeam.findMany(),
    ]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black min-h-screen">
            <div className="flex flex-col gap-1 px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {isRequester ? 'My Requests' : 'Maintenance Operations'}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {isRequester
                        ? 'Track the status of your reported issues.'
                        : 'Manage workflow, assign tasks, and track team progress.'}
                </p>
            </div>

            <div className="flex-1 p-6 bg-zinc-50/50 dark:bg-black/50 overflow-hidden">
                <KanbanBoard
                    initialRequests={requests as unknown as MaintenanceRequest[]}
                    equipments={equipments as unknown as Equipment[]}
                    technicians={technicians as unknown as User[]}
                    maintenanceTeams={maintenanceTeams as unknown as MaintenanceTeam[]}
                />
            </div>
        </div>
    );
}
