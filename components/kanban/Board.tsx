'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DropAnimation,
    closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Card } from './Card';
import { MaintenanceRequest, RequestStatus, Equipment, User, MaintenanceTeam, KanbanColumn as IKanbanColumn } from './types';
import { Plus } from 'lucide-react';
import { createPortal } from 'react-dom';
import { RequestModal } from '@/components/requests/RequestModal';
import { createMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } from '@/app/actions';

interface KanbanBoardProps {
    initialRequests: MaintenanceRequest[];
    equipments: Equipment[];
    technicians: User[];
    maintenanceTeams: MaintenanceTeam[];
    onCardMove?: (requestId: string | number, newStatus: RequestStatus) => void;
}

export function KanbanBoard({ initialRequests, equipments, technicians, maintenanceTeams, onCardMove }: KanbanBoardProps) {
    const [requests, setRequests] = React.useState<MaintenanceRequest[]>(initialRequests);
    const [activeRequest, setActiveRequest] = React.useState<MaintenanceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalInitialStatus, setModalInitialStatus] = React.useState<RequestStatus>('NEW');
    const [editingRequest, setEditingRequest] = React.useState<MaintenanceRequest | null>(null);

    // Sync with server data when it changes (revalidation)
    React.useEffect(() => {
        console.log(`[Kanban] Received ${initialRequests.length} requests from server`);
        setRequests(initialRequests);
    }, [initialRequests]);

    const handleOpenCreateModal = (status: RequestStatus = 'NEW') => {
        console.log(`[Kanban] Opening create modal for status: ${status}`);
        setModalInitialStatus(status);
        setEditingRequest(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (request: MaintenanceRequest) => {
        console.log(`[Kanban] Opening edit modal for request:`, request.id);
        setEditingRequest(request);
        setIsModalOpen(true);
    };

    const handleSaveRequest = async (request: MaintenanceRequest) => {
        if (editingRequest) {
            // Update
            // Optimistic update
            setRequests((prev: MaintenanceRequest[]) => prev.map((r: MaintenanceRequest) => String(r.id) === String(request.id) ? request : r));

            try {
                await updateMaintenanceRequest(request.id, {
                    subject: request.subject,
                    description: request.description,
                    type: request.type,
                    equipmentId: request.equipmentId,
                    status: request.status,
                    scheduledDate: request.scheduledDate,
                    durationHours: request.durationHours,
                    assignedTechnicianId: request.assignedTechnicianId,
                    maintenanceTeamId: request.maintenanceTeamId,
                });
            } catch (error) {
                console.error("Failed to update request:", error);
                // Revert on failure not implemented for brevity, but recommended
            }

        } else {
            // Create
            // Optimistic add (with temp ID, might be tricky if real ID needed for keys, but fine for UI)
            const tempRequest: MaintenanceRequest = { ...request, id: ('temp-' + Date.now()) as any };
            setRequests((prev: MaintenanceRequest[]) => [...prev, tempRequest]);

            try {
                const newReq = await createMaintenanceRequest({
                    subject: request.subject,
                    description: request.description,
                    type: request.type,
                    equipmentId: request.equipmentId,
                    status: request.status,
                    scheduledDate: request.scheduledDate,
                    durationHours: request.durationHours,
                    assignedTechnicianId: request.assignedTechnicianId,
                    createdById: request.createdById,
                    maintenanceTeamId: request.maintenanceTeamId,
                });
                // Replace temp with real
                setRequests((prev: MaintenanceRequest[]) => prev.map((r: MaintenanceRequest) => String(r.id) === String(tempRequest.id) ? newReq as unknown as MaintenanceRequest : r));
            } catch (error) {
                console.error("Failed to create request:", error);
            }
        }
        setIsModalOpen(false);
    };

    const handleDeleteRequest = async (requestId: string | number) => {
        console.log(`[Kanban] Attempting to delete: ${requestId}`);
        // alert(`Initiating delete for ${requestId}`);
        // Optimistic delete
        setRequests((prev: MaintenanceRequest[]) => {
            const filtered = prev.filter((r: MaintenanceRequest) => String(r.id) !== String(requestId));
            console.log(`[Kanban] Filtered requests from ${prev.length} to ${filtered.length}`);
            return filtered;
        });
        setIsModalOpen(false);
        try {
            const result = await deleteMaintenanceRequest(requestId);
            console.log(`[Kanban] Delete result:`, result);
            // alert(`Successfully sent delete request to server.`);
        } catch (error) {
            console.error("[Kanban] Failed to delete request:", error);
            alert(`Error deleting task: ${error}`);
        }
    };

    // Define columns structure
    const columns = React.useMemo(() => {
        const cols: IKanbanColumn[] = [
            { id: 'NEW', title: 'New Requests', requests: [] },
            { id: 'IN_PROGRESS', title: 'In Progress', requests: [] },
            { id: 'REPAIRED', title: 'Repaired', requests: [] },
            { id: 'SCRAP', title: 'Scrap', requests: [] },
        ];

        requests.forEach((req: MaintenanceRequest) => {
            const col = cols.find((c: IKanbanColumn) => c.id === req.status);
            if (col) {
                col.requests.push(req);
            } else {
                console.warn(`[Kanban] Request ${req.id} has unknown status: ${req.status}, defaulting to NEW`);
                cols[0].requests.push(req);
            }
        });
        console.log('[Kanban] Calculated columns:', cols);
        return cols;
    }, [requests]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // Increased to avoid misidentifying clicks as drags
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Task') {
            setActiveRequest(event.active.data.current.request);
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Find the containers
        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveTask) return;

        // Dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            // We generally handle reordering in onDragEnd, 
            // but for visual feedback we might update state here lightly or rely on library.
            // dnd-kit handles sorting visual automatically if we use SortableContext.
            // However, if we move BETWEEN columns, we might need to update the "status" temporarily to see it land.
        }
    }

    async function onDragEnd(event: DragEndEvent) {
        setActiveRequest(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeTask = requests.find(r => String(r.id) === String(activeId));
        if (!activeTask) return;

        const overColumnId = over.data.current?.type === 'Column'
            ? over.id
            : (over.data.current as any)?.request?.status; // If over a task, get that task's column status

        // If we dropped over a valid target that is different from current
        if (overColumnId && overColumnId !== activeTask.status) {
            // Move to new column
            const newStatus = overColumnId as RequestStatus;

            // Optimistic update
            setRequests((prev: MaintenanceRequest[]) => prev.map((req: MaintenanceRequest) => {
                if (String(req.id) === String(activeId)) {
                    return { ...req, status: newStatus };
                }
                return req;
            }));

            // Notify parent if prop exists
            if (onCardMove) {
                onCardMove(activeId, newStatus);
            }

            // Calls server action
            try {
                console.log(`[Kanban] Persisting move: ${activeId} -> ${newStatus}`);
                await updateMaintenanceRequest(activeId as any, { status: newStatus });
                console.log(`[Kanban] Move persisted successfully.`);
            } catch (err) {
                console.error("[Kanban] Failed to move card", err);
            }
        } else {
            // Same column reordering (optional: if we had an 'order' field)
            // For now, no persistent order, just status grouping.
        }
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* Page Header */}
            <div className="flex items-end justify-between px-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Maintenance Board</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">Track operational health in real-time.</p>
                    <div className="text-xs text-red-500 font-mono bg-red-50 p-1 border border-red-200 inline-block rounded">
                        Debug: Total Requests: {requests.length} |
                        Cols: {columns.map(c => `${c.id}:${c.requests.length}`).join(', ')}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 mr-4">
                        {technicians.slice(0, 4).map((t) => (
                            <div key={t.id} className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 overflow-hidden shadow-sm" title={t.name}>
                                <img src={t.image || `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} alt={t.name} />
                            </div>
                        ))}
                        {technicians.length > 4 && (
                            <div className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[11px] font-bold text-zinc-500 shadow-sm">
                                +{technicians.length - 4}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleOpenCreateModal('NEW')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Create Request
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex h-[calc(100vh-280px)] overflow-x-auto gap-6 pb-6 scrollbar-thin scrollbar-thumb-indigo-500/20">
                    {columns.map((col) => (
                        <Column
                            key={col.id}
                            column={col}
                            onAddTask={() => handleOpenCreateModal(col.id)}
                            onCardClick={handleOpenEditModal}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeRequest && (
                            <Card request={activeRequest} />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>


            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveRequest}
                onDelete={handleDeleteRequest}
                initialStatus={modalInitialStatus}
                initialData={editingRequest as any}
                equipments={equipments}
                technicians={technicians}
                maintenanceTeams={maintenanceTeams}
            />
        </div>
    );
}
