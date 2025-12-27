
'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MaintenanceRequest, RequestType } from './types';
import { Clock, AlertTriangle, User, Calendar, Settings, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to format date
const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Start of KanbanCard Component
interface KanbanCardProps {
    request: MaintenanceRequest;
    onClick?: (request: MaintenanceRequest) => void;
}

export function Card({ request, onClick }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: request.id,
        data: {
            type: 'Task',
            request,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isOverdue = new Date(request.scheduledDate) < new Date() && request.status !== 'REPAIRED' && request.status !== 'SCRAP';
    const isTypeCorrective = request.type === 'CORRECTIVE';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.(request)}
            className={cn(
                "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden shrink-0",
                "hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/50",
                isDragging && "opacity-50 ring-2 ring-indigo-500 ring-offset-2 z-[100] rotate-1 scale-105",
                // Subtle side accent
                isTypeCorrective ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-emerald-500"
            )}
        >
            {/* Header Chips */}
            <div className="flex justify-between items-start mb-3">
                <div className={cn(
                    "text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg tracking-wider flex items-center gap-1.5 shadow-sm",
                    isTypeCorrective
                        ? "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                )}>
                    {isTypeCorrective ? <AlertTriangle size={12} /> : <Settings size={12} />}
                    {request.type === 'CORRECTIVE' ? 'Corrective' : 'Preventive'}
                </div>
                <span className="text-[11px] font-bold text-zinc-400 font-mono tracking-tighter bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-md self-start uppercase">
                    ID-{String(request.id).padStart(3, '0')}
                </span>
            </div>

            {/* Main Content */}
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                {request.subject}
            </h3>

            {/* Equipment Tag */}
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-100/50 dark:bg-white/5 rounded-lg border border-transparent group-hover:border-zinc-200 dark:group-hover:border-white/10 transition-all mb-4 max-w-full">
                <Wrench size={13} className="text-zinc-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{request.equipment?.name || "No Equipment"}</span>
            </div>

            {/* Footer Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                {/* Due Date Indicator */}
                <div className={cn(
                    "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition-colors",
                    isOverdue
                        ? "bg-red-500/10 text-red-600 shadow-sm shadow-red-500/10"
                        : "bg-zinc-500/5 text-zinc-500"
                )}>
                    <Clock size={13} className={cn(isOverdue && "animate-pulse")} />
                    {new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                {/* Assigned Person */}
                <div className="relative group/avatar">
                    {request.assignedTechnician ? (
                        <div className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-white dark:ring-zinc-800 shadow-lg group-hover/avatar:ring-indigo-500 transition-all">
                            <img
                                src={request.assignedTechnician.image || `https://api.dicebear.com/7.x/initials/svg?seed=${request.assignedTechnician.name}`}
                                alt={request.assignedTechnician.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-white/10 text-zinc-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all group-hover/avatar:bg-indigo-500/10">
                            <User size={14} />
                        </div>
                    )}
                </div>
            </div>

            {/* Drag Handle visualization (optional, entire card is handle now) */}
        </div>
    );
}
