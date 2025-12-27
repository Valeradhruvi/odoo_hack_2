import { z } from "zod";
import { RequestStatus, RequestType, Role } from "@/lib/generated/prisma/client";

const numericId = z.union([
    z.number(),
    z.undefined(),
    z.string().transform((val) => (val === "" ? undefined : Number(val))),
]);

export const equipmentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    serialNumber: z.string().min(1, "Serial number is required"),
    purchaseDate: z.coerce.date(), // Use coerce to handle string input from forms
    warrantyEnd: z.coerce.date().optional().nullable(),
    location: z.string().min(1, "Location is required"),
    departmentId: numericId.pipe(z.number({ message: "Department is required" }).min(1, "Department is required")),
    maintenanceTeamId: numericId.pipe(z.number({ message: "Maintenance team is required" }).min(1, "Maintenance team is required")),
});

export const requestSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
    type: z.enum(["CORRECTIVE", "PREVENTIVE"]),
    equipmentId: numericId.pipe(z.number({ message: "Equipment is required" }).min(1, "Equipment is required")),
    scheduledDate: z.coerce.date(),
    durationHours: numericId.optional().pipe(z.number().min(1).optional()),
    maintenanceTeamId: numericId.optional().pipe(z.number().optional()), // Can be auto-assigned or selected
});

export const updateRequestStatusSchema = z.object({
    status: z.enum(["NEW", "IN_PROGRESS", "REPAIRED", "SCRAP"]),
    assignedTechnicianId: z.coerce.number().optional(),
});
