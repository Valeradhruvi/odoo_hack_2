import { prisma } from '@/lib/prisma';
import { ReportsView } from '@/components/reports/ReportsView';
import { MaintenanceRequest } from '@/components/kanban/types';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    const requests = await prisma.maintenanceRequest.findMany({
        include: {
            equipment: true,
            assignedTechnician: true,
            maintenanceTeam: true,
        }
    });

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black min-h-screen">
            <div className="flex flex-col gap-1 px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Maintenance Reports
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Overview of team performance and equipment health.
                </p>
            </div>

            <div className="flex-1 p-6 bg-zinc-50/50 dark:bg-black/50 overflow-hidden">
                <ReportsView requests={requests as unknown as MaintenanceRequest[]} />
            </div>
        </div>
    );
}
