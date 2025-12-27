"use server";

import { prisma } from "@/lib/prisma";
import { equipmentSchema } from "@/lib/validation/maintenance";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createEquipment(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { error: "Unauthorized" };
    }

    const خامrawData = {
        name: formData.get("name"),
        serialNumber: formData.get("serialNumber"),
        location: formData.get("location"),
        purchaseDate: formData.get("purchaseDate"),
        departmentId: formData.get("departmentId"),
        maintenanceTeamId: formData.get("maintenanceTeamId"),
        // In a real app we'd likely handle warrantyEnd, etc.
    };

    const validation = equipmentSchema.safeParse(خامrawData);

    if (!validation.success) {
        return { error: validation.error.message };
    }

    const data = validation.data;

    try {
        // Note: In real app, check if department and team exist
        await prisma.equipment.create({
            data: {
                name: data.name,
                serialNumber: data.serialNumber,
                location: data.location,
                purchaseDate: data.purchaseDate,
                departmentId: data.departmentId,
                maintenanceTeamId: data.maintenanceTeamId,
                ownerId: Number(session.user.id), // Assign creator as owner for now. Cast to Number
            },
        });
    } catch (error: any) {
        console.error("Database Error:", error);
        return { error: "Failed to create equipment: " + error.message };
    }

    revalidatePath("/equipment");
    redirect("/equipment");
}

export async function getEquipmentList() {
    const session = await getServerSession(authOptions);
    if (!session) return [];

    try {
        const equipment = await prisma.equipment.findMany({
            select: {
                id: true,
                name: true,
                serialNumber: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return equipment;
    } catch (error) {
        console.error("Failed to fetch equipment list:", error);
        return [];
    }
}
