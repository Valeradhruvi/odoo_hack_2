import { CalendarView } from '@/components/calendar/CalendarView';
import { prisma } from '@/lib/prisma';
import { MaintenanceRequest, Equipment, User, MaintenanceTeam } from '@/components/kanban/types';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
    const [preventiveRequests, equipments, technicians, maintenanceTeams] = await Promise.all([
        prisma.maintenanceRequest.findMany({
            where: {
                type: 'PREVENTIVE',
            },
            include: {
                equipment: true,
                assignedTechnician: true,
                createdBy: true,
                maintenanceTeam: true,
            },
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
                    Preventive Schedule
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Manage upcoming preventive maintenance tasks.
                </p>
            </div>

            <div className="flex-1 p-6 bg-zinc-50/50 dark:bg-black/50 overflow-hidden">
                <CalendarView
                    requests={preventiveRequests as unknown as MaintenanceRequest[]}
                    equipments={equipments as unknown as Equipment[]}
                    technicians={technicians as unknown as User[]}
                    maintenanceTeams={maintenanceTeams as unknown as MaintenanceTeam[]}
                />
            </div>
        </div>
    );
}
