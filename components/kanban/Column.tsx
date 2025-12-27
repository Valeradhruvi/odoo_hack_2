
'use client';

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Card } from './Card';
import { MaintenanceRequest, KanbanColumn as IKanbanColumn } from './types';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Plus } from 'lucide-react';

interface KanbanColumnProps {
    column: IKanbanColumn;
    onAddTask?: () => void;
    onCardClick?: (request: MaintenanceRequest) => void;
}

export function Column({ column, onAddTask, onCardClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
    });

    const requestIds = React.useMemo(() => {
        return column.requests.map((req) => req.id);
    }, [column.requests]);

    const getColumnColor = (id: string) => {
        switch (id) {
            case 'NEW': return 'bg-blue-500';
            case 'IN_PROGRESS': return 'bg-amber-500';
            case 'REPAIRED': return 'bg-emerald-500';
            case 'SCRAP': return 'bg-red-500';
            default: return 'bg-zinc-500';
        }
    }

    return (
        <div className="flex flex-col h-full w-[360px] min-w-[360px] glass rounded-[24px] overflow-hidden group/col transition-all duration-300">
            {/* Column Header */}
            <div className="p-5 flex items-center justify-between sticky top-0 bg-transparent z-10 border-b border-zinc-200/30 dark:border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] ring-2 ring-white dark:ring-zinc-900", getColumnColor(column.id))} />
                    <h2 className="font-extrabold text-[13px] uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        {column.title === 'New Requests' ? 'Incoming' : column.title}
                    </h2>
                    <span className="bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 text-[10px] font-black px-2 py-0.5 rounded-md min-w-[20px] text-center">
                        {column.requests.length}
                    </span>
                </div>
                <button className="text-zinc-400 hover:text-indigo-500 p-1.5 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all shadow-sm">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className="flex-1 p-4 flex flex-col gap-5 overflow-y-auto min-h-[150px] scrollbar-hide group-hover/col:scrollbar-thin"
            >
                <SortableContext items={requestIds} strategy={verticalListSortingStrategy}>
                    {column.requests.map((request) => (
                        <Card key={request.id} request={request} onClick={onCardClick} />
                    ))}
                </SortableContext>

                {/* Empty State placeholder */}
                {column.requests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[20px] text-zinc-400 text-xs text-center space-y-3 opacity-60">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                            <Plus size={20} className="opacity-20" />
                        </div>
                        <p className="font-medium">Drag or drop here<br />to assign requests</p>
                    </div>
                )}
            </div>

            {/* Quick Add Button */}
            <div className="p-4 pt-0">
                <button
                    onClick={onAddTask}
                    className="w-full flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-indigo-600 py-3 rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 hover:border-transparent hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-xs font-bold uppercase tracking-widest group/btn"
                >
                    <Plus size={16} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                    New Request
                </button>
            </div>
        </div>
    );
}
