"use server";

import { prisma } from "@/lib/prisma";
import { requestSchema, updateRequestStatusSchema } from "@/lib/validation/maintenance";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createRequest(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { error: "Unauthorized" };
    }

    const rawData = {
        subject: formData.get("subject"),
        description: formData.get("description"),
        type: formData.get("type"),
        equipmentId: formData.get("equipmentId"),
        scheduledDate: formData.get("scheduledDate"),
        durationHours: formData.get("durationHours"),
        maintenanceTeamId: formData.get("maintenanceTeamId"),
    };

    const validation = requestSchema.safeParse(rawData);

    if (!validation.success) {
        return { error: validation.error.errors[0].message };
    }

    const data = validation.data;

    try {
        await prisma.maintenanceRequest.create({
            data: {
                subject: data.subject,
                description: data.description,
                type: data.type,
                equipmentId: data.equipmentId,
                scheduledDate: data.scheduledDate,
                durationHours: data.durationHours,
                maintenanceTeamId: data.maintenanceTeamId,
                createdById: Number(session.user.id),
            },
        });
    } catch (error: any) {
        console.error("Database Error:", error);
        return { error: "Failed to create request: " + error.message };
    }

    revalidatePath("/requests");
    revalidatePath(`/equipment/${data.equipmentId}`);
    redirect("/requests");
}

export async function updateRequestStatus(requestId: number, formData: FormData) {
    // Implement status update logic (e.g. for Kanban)
    // This will be called when dragging cards or detailing
}
