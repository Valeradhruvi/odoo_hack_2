"use client";

import React, { useState, useEffect } from 'react';
import { MaintenanceRequest, RequestStatus, RequestType, Equipment, MaintenanceTeam, User } from '@/components/kanban/types';
import { Modal } from '@/components/ui/Modal';
import { Trash } from 'lucide-react';

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (request: MaintenanceRequest) => void;
    onDelete?: (requestId: string | number) => void;
    initialStatus?: RequestStatus;
    initialType?: RequestType;
    initialDate?: Date;
    initialData?: MaintenanceRequest | null;
    equipments: Equipment[];
    technicians: User[];
    maintenanceTeams: MaintenanceTeam[];
}

export function RequestModal({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    initialStatus = 'NEW',
    initialType = 'CORRECTIVE',
    initialDate,
    initialData,
    equipments,
    technicians,
    maintenanceTeams
}: RequestModalProps) {
    const isEditMode = !!initialData;

    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<RequestType>('CORRECTIVE');
    const [equipmentId, setEquipmentId] = useState('');
    const [status, setStatus] = useState<RequestStatus>(initialStatus);
    const [technicianId, setTechnicianId] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [duration, setDuration] = useState('1');

    // Helper for date
    const toLocalISO = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setSubject(initialData.subject);
                setDescription(initialData.description || '');
                setType(initialData.type);
                setEquipmentId(String(initialData.equipmentId));
                setStatus(initialData.status);
                setTechnicianId(String(initialData.assignedTechnicianId || (technicians[0]?.id || '')));
                setScheduledDate(toLocalISO(new Date(initialData.scheduledDate)));
                setDuration(initialData.durationHours?.toString() || '1');
            } else {
                // Reset for create mode
                setSubject('');
                setDescription('');
                setType(initialType);
                setEquipmentId(String(equipments[0]?.id || ''));
                setStatus(initialStatus);
                setTechnicianId(String(technicians[0]?.id || ''));
                const d = initialDate ? new Date(initialDate) : new Date();
                setScheduledDate(toLocalISO(d));
                setDuration('1');
            }
        }
    }, [isOpen, initialData, initialStatus, initialDate, equipments, technicians]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const requestData: MaintenanceRequest = {
            id: initialData?.id || (Date.now() as any), // Temp for optimistic UI
            subject,
            description: description || null,
            type,
            equipmentId: Number(equipmentId),
            status,
            scheduledDate: new Date(scheduledDate),
            durationHours: Number(duration),
            createdById: initialData?.createdById || 0, // Needs session
            assignedTechnicianId: technicianId ? Number(technicianId) : null,
            maintenanceTeamId: initialData?.maintenanceTeamId || (maintenanceTeams[0]?.id || null),
            createdAt: initialData?.createdAt || new Date(),
            updatedAt: new Date(),
            // Relations for optimistic UI
            equipment: equipments.find(e => String(e.id) === String(equipmentId)) || null,
            assignedTechnician: technicians.find(t => String(t.id) === String(technicianId)) || null,
            maintenanceTeam: maintenanceTeams.find(t => String(t.id) === String(initialData?.maintenanceTeamId || maintenanceTeams[0]?.id)) || null,
        };

        onSubmit(requestData);
        onClose();
    };

    const handleDelete = () => {
        console.log(`[RequestModal] Delete button clicked. initialData:`, initialData);
        if (initialData && onDelete) {
            if (confirm('GEAR GUARD: Are you sure you want to permanently delete this task?')) {
                console.log(`[RequestModal] Confirmed delete for ID: ${initialData.id}`);
                onDelete(initialData.id);
                onClose();
            } else {
                console.log(`[RequestModal] Delete cancelled by user.`);
            }
        } else {
            alert("CANNOT DELETE: No initial data or delete handler. This usually means you are in 'Create' mode, not 'Edit' mode.");
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${isEditMode ? "Edit" : "New"} Maintenance Request ${isEditMode ? `[ID: ${String(initialData?.id).padStart(3, '0')}]` : ""}`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Broken Conveyor Belt"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                        placeholder="Describe the issue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={type}
                            onChange={(e) => setType(e.target.value as RequestType)}
                        >
                            <option value="CORRECTIVE">Corrective</option>
                            <option value="PREVENTIVE">Preventive</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as RequestStatus)}
                        >
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REPAIRED">Repaired</option>
                            <option value="SCRAP">Scrap</option>
                        </select>
                    </div>
                </div>

                {/* Equipment */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Equipment</label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={equipmentId}
                        onChange={(e) => setEquipmentId(e.target.value)}
                    >
                        {equipments.map(eq => (
                            <option key={eq.id} value={String(eq.id)}>{eq.name}</option>
                        ))}
                    </select>
                </div>

                {/* Technician */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Assigned Technician</label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={technicianId}
                        onChange={(e) => setTechnicianId(e.target.value)}
                    >
                        {technicians.map(user => (
                            <option key={user.id} value={String(user.id)}>{user.name}</option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Scheduled Date</label>
                    <input
                        type="datetime-local"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    {isEditMode && onDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash size={16} />
                            Delete
                        </button>
                    ) : <div />}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                        >
                            {isEditMode ? 'Save Changes' : 'Create Request'}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
