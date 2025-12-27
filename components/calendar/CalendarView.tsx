
'use client';

import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { MaintenanceRequest, Equipment, User, MaintenanceTeam } from '@/components/kanban/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Wrench } from 'lucide-react';
import { RequestModal } from '@/components/requests/RequestModal';
import { createMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } from '@/app/actions';
import { DayViewModal } from './DayViewModal';

interface CalendarViewProps {
    requests: MaintenanceRequest[];
    equipments: Equipment[];
    technicians: User[];
    maintenanceTeams: MaintenanceTeam[];
}

export function CalendarView({ requests: initialRequests, equipments, technicians, maintenanceTeams }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [requests, setRequests] = React.useState<MaintenanceRequest[]>(initialRequests);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [isDayViewOpen, setIsDayViewOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [editingRequest, setEditingRequest] = React.useState<MaintenanceRequest | null>(null);
    const [hoveredInfo, setHoveredInfo] = React.useState<{ date: Date; tasks: MaintenanceRequest[]; rect: DOMRect } | null>(null);

    // Sync with server data when it changes (revalidation)
    React.useEffect(() => {
        console.log(`[Calendar] Received ${initialRequests.length} requests from server`);
        setRequests(initialRequests);
    }, [initialRequests]);

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const handleDateClick = (day: Date) => {
        console.log(`[Calendar] Date clicked: ${day.toDateString()}`);
        setSelectedDate(day);
        setIsDayViewOpen(true);
    };

    const handleCreateNew = () => {
        setIsDayViewOpen(false); // Close day view to open create modal
        setEditingRequest(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (req: MaintenanceRequest) => {
        console.log(`[Calendar] Opening edit modal for request: ${req.id}`);
        setEditingRequest(req);
        setIsDayViewOpen(false); // Close day view to open edit modal
        setIsCreateModalOpen(true);
    };

    const handleSaveRequest = async (request: MaintenanceRequest) => {
        if (editingRequest) {
            // Update
            setRequests((prev: MaintenanceRequest[]) => prev.map((req: MaintenanceRequest) => String(req.id) === String(request.id) ? request : req));
            setIsCreateModalOpen(false);
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
                console.error("Failed to update request", error);
            }
        } else {
            // Create
            setRequests((prev: MaintenanceRequest[]) => [...prev, request]);
            setIsCreateModalOpen(false);

            try {
                const created = await createMaintenanceRequest({
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
                setRequests((prev: MaintenanceRequest[]) => prev.map((req: MaintenanceRequest) => String(req.id) === String(request.id) ? created as unknown as MaintenanceRequest : req));
            } catch (error) {
                console.error("Failed to create request", error);
            }
        }
    };

    const handleDeleteRequest = async (requestId: string | number) => {
        console.log(`[Calendar] Attempting to delete: ${requestId}`);
        setRequests((prev: MaintenanceRequest[]) => {
            const filtered = prev.filter((req: MaintenanceRequest) => String(req.id) !== String(requestId));
            console.log(`[Calendar] Filtered requests from ${prev.length} to ${filtered.length}`);
            return filtered;
        });
        setIsCreateModalOpen(false);
        try {
            const result = await deleteMaintenanceRequest(requestId);
            console.log(`[Calendar] Delete result:`, result);
        } catch (error) {
            console.error("[Calendar] Failed to delete request", error);
        }
    };

    // Get tasks for selected date
    const selectedDateTasks = requests.filter(req => isSameDay(new Date(req.scheduledDate), selectedDate));

    return (
        <div className="flex flex-col gap-8 h-full relative">
            {/* Page Header */}
            <div className="flex items-end justify-between px-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Planning Calendar</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">Schedule and coordinate preventive maintenance.</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
                    <div className="flex items-center gap-2 px-3">
                        <CalendarIcon className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-sm tracking-tight">{format(currentDate, 'MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                        <button onClick={prevMonth} className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all text-zinc-500 hover:text-indigo-600">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextMonth} className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all text-zinc-500 hover:text-indigo-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                        onClick={() => handleDateClick(new Date())}
                    >
                        <Plus size={16} />
                        New Schedule
                    </button>
                </div>
            </div>

            <div className="flex-1 glass rounded-[32px] overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/5">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 border-b border-zinc-200/30 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5 backdrop-blur-md">
                    {weekDays.map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 bg-zinc-200/20 dark:bg-white/5 gap-px">
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, firstDayOfMonth);
                        const dayRequests = requests.filter(req => isSameDay(new Date(req.scheduledDate), day));

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => handleDateClick(day)}
                                onMouseEnter={(e) => {
                                    if (dayRequests.length > 0) {
                                        setHoveredInfo({ date: day, tasks: dayRequests, rect: e.currentTarget.getBoundingClientRect() });
                                    }
                                }}
                                onMouseLeave={() => setHoveredInfo(null)}
                                className={cn(
                                    "bg-white dark:bg-slate-950/40 min-h-[120px] p-3 flex flex-col gap-2 transition-all hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 cursor-pointer group relative",
                                    !isCurrentMonth && "opacity-50 grayscale bg-zinc-50/50 dark:bg-white/5",
                                    isToday(day) && "bg-indigo-50/20 dark:bg-indigo-900/5 ring-1 ring-indigo-500/20 inset-0 z-10"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={cn(
                                        "text-xs font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                                        isToday(day)
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110"
                                            : "text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 group-hover:bg-zinc-100 dark:group-hover:bg-white/5"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {dayRequests.length > 0 && (
                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                                            {dayRequests.length}
                                        </span>
                                    )}
                                </div>

                                {/* Requests List (Preview) */}
                                <div className="flex flex-col gap-1.5 mt-1 overflow-hidden">
                                    {dayRequests.slice(0, 2).map(req => (
                                        <div
                                            key={req.id}
                                            className={cn(
                                                "text-[10px] font-bold truncate px-2 py-1.5 rounded-lg border shadow-sm flex items-center gap-1.5",
                                                req.status === 'REPAIRED'
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400"
                                                    : "bg-white text-zinc-700 border-zinc-200 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300"
                                            )}
                                        >
                                            <div className={cn("w-1.5 h-1.5 rounded-full", req.status === 'REPAIRED' ? "bg-emerald-500" : "bg-indigo-500")} />
                                            <span className="truncate">{req.subject}</span>
                                        </div>
                                    ))}
                                    {dayRequests.length > 2 && (
                                        <div className="text-[9px] font-black text-zinc-400 text-center uppercase tracking-widest pt-1 px-1">
                                            + {dayRequests.length - 2} tasks
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hover Card */}
            {hoveredInfo && (
                <div
                    className="fixed z-50 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                    style={{
                        top: Math.min(hoveredInfo.rect.top, window.innerHeight - 250),
                        left: hoveredInfo.rect.right + 310 > window.innerWidth ? hoveredInfo.rect.left - 300 : hoveredInfo.rect.right + 10
                    }}
                >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{format(hoveredInfo.date, 'MMM d, yyyy')}</h4>
                        <span className="text-xs font-medium text-zinc-500">{hoveredInfo.tasks.length} Tasks</span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[200px] overflow-hidden">
                        {hoveredInfo.tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-2 text-xs">
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    task.status === 'REPAIRED' ? "bg-emerald-500" :
                                        task.status === 'NEW' ? "bg-blue-500" : "bg-indigo-500"
                                )} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">{task.subject}</p>
                                    <p className="text-zinc-400 truncate text-[10px]">{task.equipment?.name}</p>
                                </div>
                            </div>
                        ))}
                        {hoveredInfo.tasks.length > 5 && (
                            <p className="text-[10px] text-zinc-400 text-center italic pt-1">
                                + {hoveredInfo.tasks.length - 5} more...
                            </p>
                        )}
                    </div>
                </div>
            )}

            <DayViewModal
                isOpen={isDayViewOpen}
                onClose={() => setIsDayViewOpen(false)}
                date={selectedDate}
                tasks={selectedDateTasks}
                onAddTask={handleCreateNew}
                onEditTask={handleOpenEditModal}
            />

            <RequestModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleSaveRequest}
                onDelete={handleDeleteRequest}
                initialDate={selectedDate}
                initialStatus="NEW"
                initialType="PREVENTIVE"
                initialData={editingRequest}
                equipments={equipments}
                technicians={technicians}
                maintenanceTeams={maintenanceTeams}
            />
        </div>
    );
}
