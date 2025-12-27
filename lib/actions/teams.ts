"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getMaintenanceTeams() {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        const teams = await prisma.maintenanceTeam.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return { teams };
    } catch (error) {
        console.error("Failed to fetch maintenance teams:", error);
        return { error: "Failed to fetch maintenance teams" };
    }
}
