"use server";

import { prisma } from "@/lib/prisma";
import { requestSchema, updateRequestStatusSchema } from "@/lib/validation/maintenance";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createRequest(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return { error: "Unauthorized" };
    }

    const userId = Number(session.user.id);
    if (isNaN(userId)) {
        return { error: "Invalid session. Please logout and login again to refresh your account." };
    }

    const rawData = {
        subject: formData.get("subject"),
        description: formData.get("description"),
        type: formData.get("type"),
        equipmentId: formData.get("equipmentId"),
        scheduledDate: formData.get("scheduledDate"),
        durationHours: formData.get("durationHours") || undefined,
        maintenanceTeamId: formData.get("maintenanceTeamId") || undefined,
    };

    const validation = requestSchema.safeParse(rawData);

    if (!validation.success) {
        console.error("Validation Error:", validation.error.format());
        return { error: validation.error.message };
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
        console.log("Request created successfully");
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

export async function getDashboardStats(userId?: number, role?: string) {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const where: any = {};
    if (role === "TECHNICIAN" && userId) {
        where.assignedTechnicianId = userId;
    } else if (role === "REQUESTER" && userId) {
        where.createdById = userId;
    }

    try {
        const [total, pending, inProgress, completed] = await Promise.all([
            prisma.maintenanceRequest.count({ where }),
            prisma.maintenanceRequest.count({ where: { ...where, status: "NEW" } }),
            prisma.maintenanceRequest.count({ where: { ...where, status: "IN_PROGRESS" } }),
            prisma.maintenanceRequest.count({ where: { ...where, status: "REPAIRED" } }),
        ]);

        return {
            total,
            pending,
            inProgress,
            completed,
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return null;
    }
}

export async function getRecentRequests(limit: number = 5, userId?: number, role?: string) {
    const session = await getServerSession(authOptions);
    if (!session) return [];

    const where: any = {};
    if (role === "TECHNICIAN" && userId) {
        where.assignedTechnicianId = userId;
    } else if (role === "REQUESTER" && userId) {
        where.createdById = userId;
    }

    try {
        const requests = await prisma.maintenanceRequest.findMany({
            where,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                equipment: {
                    select: {
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return requests;
    } catch (error) {
        console.error("Failed to fetch recent requests:", error);
        return [];
    }
}
