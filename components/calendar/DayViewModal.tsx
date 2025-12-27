"use client";

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { MaintenanceRequest } from '@/components/kanban/types';
import { format } from 'date-fns';
import { Plus, Clock, CheckCircle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface DayViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    tasks: MaintenanceRequest[];
    onAddTask: () => void;
    onEditTask: (task: MaintenanceRequest) => void;
}

export function DayViewModal({ isOpen, onClose, date, tasks, onAddTask, onEditTask }: DayViewModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Schedule for ${format(date, 'MMMM d, yyyy')}`}
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="flex gap-4 text-sm text-zinc-500">
                        <span className="font-medium text-zinc-900 dark:text-zinc-200">{tasks.length} Tasks</span>
                        <span>•</span>
                        <span>{tasks.filter(t => t.status === 'REPAIRED').length} Completed</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                    {tasks.length === 0 ? (
                        <div className="py-8 text-center flex flex-col items-center gap-2 text-zinc-400">
                            <Clock size={32} className="opacity-20" />
                            <p className="text-sm">No tasks scheduled for this day.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => onEditTask(task)}
                                className="group flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-indigo-500/30 bg-white dark:bg-white/5 hover:bg-indigo-50/10 cursor-pointer transition-all"
                            >
                                <div className={cn(
                                    "mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    task.status === 'REPAIRED'
                                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        : task.type === 'CORRECTIVE'
                                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                )}>
                                    {task.status === 'REPAIRED' ? <CheckCircle size={16} /> : <Wrench size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-500 transition-colors">
                                        {task.subject}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                        <span className="truncate max-w-[120px]">
                                            {task.equipment?.name || "Unknown Equipment"}
                                        </span>
                                        {task.assignedTechnician && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                                <span className="truncate">{task.assignedTechnician.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn(
                                        "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border",
                                        task.status === 'NEW' ? "border-blue-200 text-blue-600 bg-blue-50" :
                                            task.status === 'IN_PROGRESS' ? "border-yellow-200 text-yellow-600 bg-yellow-50" :
                                                task.status === 'REPAIRED' ? "border-green-200 text-green-600 bg-green-50" :
                                                    "border-red-200 text-red-600 bg-red-50"
                                    )}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={onAddTask}
                    className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-500/20"
                >
                    <Plus size={18} />
                    Add Task
                </button>
            </div>
        </Modal>
    );
}
