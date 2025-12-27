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

    const rawData = {
        name: formData.get("name"),
        serialNumber: formData.get("serialNumber"),
        location: formData.get("location"),
        purchaseDate: formData.get("purchaseDate"),
        departmentId: formData.get("departmentId"),
        maintenanceTeamId: formData.get("maintenanceTeamId"),
        // In a real app we'd likely handle warrantyEnd, etc.
    };

    const validation = equipmentSchema.safeParse(rawData);

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
                ownerId: session.user.id, // Assign creator as owner for now, or handle differently
            },
        });
    } catch (error: any) {
        console.error("Database Error:", error);
        return { error: "Failed to create equipment: " + error.message };
    }

    revalidatePath("/equipment");
    redirect("/equipment");
}
