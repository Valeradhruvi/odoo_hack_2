"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/lib/generated/prisma/enums";

export async function getDepartments() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        throw new Error("Unauthorized");
    }

    try {
        const departments = await prisma.department.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return { departments };
    } catch (error) {
        console.error("Failed to fetch departments:", error);
        return { error: "Failed to fetch departments" };
    }
}

export async function getDepartmentOptions() {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return { departments };
    } catch (error) {
        console.error("Failed to fetch department options:", error);
        return { error: "Failed to fetch departments" };
    }
}
