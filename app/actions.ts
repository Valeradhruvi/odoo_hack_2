'use server'

import { prisma } from '@/lib/prisma'
import { MaintenanceRequest, RequestStatus, RequestType } from '@/lib/generated/prisma/client'
import { revalidatePath } from 'next/cache'

// Define input types if strict validation is needed, or just use partials
// For now, I'll trust the payload from the client matches what we expect, or validate basic fields.

export async function createMaintenanceRequest(data: {
    subject: string;
    description?: string | null;
    type: RequestType;
    equipmentId: number | string;
    status: RequestStatus;
    scheduledDate: Date;
    durationHours?: number | null;
    assignedTechnicianId?: number | string | null;
    createdById: number | string;
    maintenanceTeamId?: number | string | null;
}) {
    let finalCreatedById = typeof data.createdById === 'string' ? parseInt(data.createdById) : data.createdById;

    // Dev fallback: if NaN or empty, use the first user in DB to avoid FK errors
    if (!finalCreatedById || isNaN(finalCreatedById)) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            finalCreatedById = firstUser.id;
        }
    }

    const request = await prisma.maintenanceRequest.create({
        data: {
            subject: data.subject,
            description: data.description,
            type: data.type,
            equipmentId: Number(data.equipmentId),
            status: data.status,
            scheduledDate: data.scheduledDate,
            durationHours: data.durationHours,
            assignedTechnicianId: data.assignedTechnicianId ? Number(data.assignedTechnicianId) : null,
            createdById: finalCreatedById,
            maintenanceTeamId: data.maintenanceTeamId ? Number(data.maintenanceTeamId) : null,
        },
        include: {
            equipment: true,
            assignedTechnician: true,
            createdBy: true,
            maintenanceTeam: true,
        }
    });

    revalidatePath('/dashboard/kanban');
    revalidatePath('/requests/calendar');
    return request;
}

export async function updateMaintenanceRequest(id: string | number, data: Partial<{
    subject: string;
    description: string | null;
    type: RequestType;
    equipmentId: string | number;
    status: RequestStatus;
    scheduledDate: Date;
    durationHours: number | null;
    assignedTechnicianId: string | number | null;
    maintenanceTeamId: string | number | null;
}>) {
    const updateData: any = { ...data };
    if (data.equipmentId) updateData.equipmentId = Number(data.equipmentId);
    if (data.assignedTechnicianId) updateData.assignedTechnicianId = Number(data.assignedTechnicianId);
    if (data.maintenanceTeamId) updateData.maintenanceTeamId = Number(data.maintenanceTeamId);

    const request = await prisma.maintenanceRequest.update({
        where: { id: Number(id) },
        data: updateData,
        include: {
            equipment: true,
            assignedTechnician: true,
            createdBy: true,
            maintenanceTeam: true,
        }
    });

    revalidatePath('/dashboard/kanban');
    revalidatePath('/requests/calendar');
    return request;
}

export async function deleteMaintenanceRequest(id: string | number) {
    console.log(`🗑️ Deleting request: ${id}`);
    try {
        await prisma.maintenanceRequest.delete({
            where: { id: Number(id) },
        });

        revalidatePath('/dashboard/kanban');
        revalidatePath('/requests/calendar');
        return { success: true };
    } catch (error) {
        console.error("❌ Delete action failed:", error);
        throw error;
    }
}
