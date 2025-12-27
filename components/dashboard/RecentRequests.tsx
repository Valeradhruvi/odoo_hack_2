"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { RequestStatus } from "@/lib/generated/prisma/enums";

interface RecentRequestsProps {
    requests: any[];
}

export function RecentRequests({ requests }: RecentRequestsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
            case "IN_PROGRESS": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "REPAIRED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "SCRAP": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
            default: return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
        }
    };

    return (
        <Card className="glass border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-xl font-black tracking-tight">Recent Activity</CardTitle>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Latest maintenance requests</p>
                </div>
                <Badge variant="outline" className="rounded-xl border-indigo-500/30 text-indigo-500 font-bold px-3 py-1">
                    Live Updates
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="rounded-2xl border border-zinc-200/50 dark:border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50/50 dark:bg-white/5">
                            <TableRow className="hover:bg-transparent border-b border-zinc-200/50 dark:border-white/5">
                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-zinc-500">Subject</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-zinc-500">Equipment</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-zinc-500">Date</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-zinc-500">Status</TableHead>
                                <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest text-zinc-500">Requester</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500 font-medium italic">
                                        No recent requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
                                    <TableRow key={request.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors border-b border-zinc-200/50 dark:border-white/5 last:border-0 cursor-pointer group">
                                        <TableCell className="py-4">
                                            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors">
                                                {request.subject}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                {request.equipment.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold text-zinc-400 flex flex-col">
                                                <span>{format(new Date(request.createdAt), "MMM d, yyyy")}</span>
                                                <span className="text-[10px] opacity-60 font-medium uppercase">{format(new Date(request.createdAt), "HH:mm")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(request.status)}>
                                                {request.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="flex flex-col text-right">
                                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                                        {request.createdBy.name}
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-xs border border-indigo-500/20">
                                                    {request.createdBy.name[0]}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
