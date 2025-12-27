"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { requestSchema } from "@/lib/validation/maintenance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRequest } from "@/lib/actions/requests";
import { Loader2 } from "lucide-react";
import { RequestType } from "@/lib/generated/prisma/enums";
import { useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type RequestFormData = z.output<typeof requestSchema>;
type RequestFormInput = z.input<typeof requestSchema>;

export function RequestForm({
    equipmentList,
    maintenanceTeams,
    technicians,
    userRole
}: {
    equipmentList: { id: number; name: string; serialNumber: string }[],
    maintenanceTeams: { id: number; name: string }[],
    technicians: { id: number; name: string }[],
    userRole?: string | null
}) {
    const searchParams = useSearchParams();
    const initialEquipmentId = searchParams.get("equipmentId") || "";

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<RequestFormInput, any, RequestFormData>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            equipmentId: initialEquipmentId ? Number(initialEquipmentId) : undefined,
            type: userRole === 'REQUESTER' ? 'CORRECTIVE' : undefined
        }
    });

    async function onSubmit(data: RequestFormData) {
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        try {
            const result = await createRequest(formData);
            if (result?.error) {
                setMessage(result.error);
            }
        } catch (error) {
            setMessage("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>New Maintenance Request</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" {...register("subject")} placeholder="e.g., Printer Jam, AC Leak" />
                        {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description")} placeholder="Details about the issue..." />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="equipmentId">Equipment</Label>
                        <Controller
                            name="equipmentId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Equipment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equipmentList.map((eq) => (
                                            <SelectItem key={eq.id} value={String(eq.id)}>
                                                {eq.name} ({eq.serialNumber})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.equipmentId && <p className="text-sm text-red-500">{errors.equipmentId.message}</p>}
                    </div>

                    {userRole === 'REQUESTER' ? (
                        /* HIDDEN FIELDS FOR REQUESTER */
                        <>
                            <input type="hidden" {...register("type")} value="CORRECTIVE" />
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-400">
                                <p className="font-semibold">Note</p>
                                <p>This request will be automatically categorized as <span className="font-bold">Corrective Maintenance</span>.</p>
                            </div>
                        </>
                    ) : (
                        /* FULL ADMIN/TECH FIELDS */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    {...register("type")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {Object.values(RequestType).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maintenanceTeamId">Maintenance Team (Optional)</Label>
                                <Controller
                                    name="maintenanceTeamId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {maintenanceTeams.map((team) => (
                                                    <SelectItem key={team.id} value={String(team.id)}>
                                                        {team.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assignedTechnicianId">Assigned Technician (Optional)</Label>
                                <Controller
                                    name="assignedTechnicianId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Technician" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {technicians.map((tech) => (
                                                    <SelectItem key={tech.id} value={String(tech.id)}>
                                                        {tech.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                                <Input id="scheduledDate" type="datetime-local" {...register("scheduledDate", { valueAsDate: true })} />
                                {errors.scheduledDate && <p className="text-sm text-red-500">{errors.scheduledDate.message}</p>}
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label htmlFor="durationHours">Est. Duration (Hours)</Label>
                                <Input id="durationHours" type="number" step="0.1" {...register("durationHours", { valueAsNumber: true })} />
                                {errors.durationHours && <p className="text-sm text-red-500">{errors.durationHours.message}</p>}
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="p-4 rounded-md bg-red-50 text-red-700">
                            {message}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Request
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
