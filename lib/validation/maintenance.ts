import { z } from "zod";
import { RequestStatus, RequestType, Role } from "@/lib/generated/prisma/client";

export const equipmentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    serialNumber: z.string().min(1, "Serial number is required"),
    purchaseDate: z.coerce.date(), // Use coerce to handle string input from forms
    warrantyEnd: z.coerce.date().optional().nullable(),
    location: z.string().min(1, "Location is required"),
    departmentId: z.string().min(1, "Department is required"),
    maintenanceTeamId: z.string().min(1, "Maintenance team is required"),
});

export const requestSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
    type: z.enum(["CORRECTIVE", "PREVENTIVE"]),
    equipmentId: z.string().min(1, "Equipment is required"),
    scheduledDate: z.coerce.date(),
    durationHours: z.coerce.number().min(1).optional(),
    maintenanceTeamId: z.string().optional(), // Can be auto-assigned or selected
});

export const updateRequestStatusSchema = z.object({
    status: z.enum(["NEW", "IN_PROGRESS", "REPAIRED", "SCRAP"]),
    assignedTechnicianId: z.string().optional(),
});
