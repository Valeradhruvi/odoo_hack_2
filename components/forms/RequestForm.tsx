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

type RequestFormData = z.infer<typeof requestSchema>;

export function RequestForm({ equipmentList }: { equipmentList: { id: number; name: string; serialNumber: string }[] }) {
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
    } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            equipmentId: initialEquipmentId ? Number(initialEquipmentId) : undefined
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
                        <Input id="subject" {...register("subject")} placeholder="Routine Checkup" />
                        {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description")} placeholder="Details about the issue..." />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="scheduledDate">Scheduled Date</Label>
                            <Input id="scheduledDate" type="date" {...register("scheduledDate")} />
                            {errors.scheduledDate && <p className="text-sm text-red-500">{errors.scheduledDate.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="durationHours">Estimated Duration (Hours)</Label>
                            <Input id="durationHours" type="number" {...register("durationHours")} />
                            {errors.durationHours && <p className="text-sm text-red-500">{errors.durationHours.message}</p>}
                        </div>
                    </div>

                    {message && (
                        <div className="p-4 rounded-md bg-red-50 text-red-700">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Request
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
