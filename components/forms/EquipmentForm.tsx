"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { equipmentSchema } from "@/lib/validation/maintenance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createEquipment } from "@/lib/actions/equipment";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
    departments: { id: number; name: string }[];
    teams: { id: number; name: string }[];
}

export function EquipmentForm({ departments, teams }: EquipmentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<EquipmentFormData>({
        resolver: zodResolver(equipmentSchema),
    });

    async function onSubmit(data: EquipmentFormData) {
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
            const result = await createEquipment(formData);
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage("Equipment created successfully!");
                reset();
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
                <CardTitle>Add New Equipment</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name")} placeholder="CNC Machine" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serialNumber">Serial Number</Label>
                            <Input id="serialNumber" {...register("serialNumber")} placeholder="SN-123456" />
                            {errors.serialNumber && <p className="text-sm text-red-500">{errors.serialNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...register("location")} placeholder="Shop Floor 1" />
                            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Purchase Date</Label>
                            <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
                            {errors.purchaseDate && <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="departmentId">Department</Label>
                            <Controller
                                name="departmentId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value || "")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={String(dept.id)}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maintenanceTeamId">Maintenance Team</Label>
                            <Controller
                                name="maintenanceTeamId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value || "")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={String(team.id)}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.maintenanceTeamId && <p className="text-sm text-red-500">{errors.maintenanceTeamId.message}</p>}
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-md ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Equipment
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
