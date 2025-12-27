import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/kanban/Board"; // Need to create this
import { RequestStatus } from "@/lib/generated/prisma/client";

async function getKanbanData() {
    const requests = await prisma.maintenanceRequest.findMany({
        include: {
            equipment: true,
            assignedTechnician: true,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return requests;
}

export default async function KanbanPage() {
    const requests = await getKanbanData();

    return (
        <div className="h-screen flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">Maintenance Board</h1>
            </div>
            <div className="flex-1 overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900/50">
                <KanbanBoard initialData={requests} />
            </div>
        </div>
    );
}
