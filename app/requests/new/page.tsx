import { RequestForm } from "@/components/forms/RequestForm";
import { getEquipmentList } from "@/lib/actions/equipment";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

async function getTeamsAndTechs() {
    const [teams, technicians] = await Promise.all([
        prisma.maintenanceTeam.findMany(),
        prisma.user.findMany({ where: { role: 'TECHNICIAN' } })
    ]);
    return { teams, technicians };
}

export default async function NewRequestPage() {
    const equipmentList = await getEquipmentList();
    const { teams, technicians } = await getTeamsAndTechs();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Maintenance Request</h1>
            <Suspense fallback={<div>Loading form...</div>}>
                <RequestForm
                    equipmentList={equipmentList}
                    maintenanceTeams={teams}
                    technicians={technicians}
                />
            </Suspense>
        </div>
    );
}
