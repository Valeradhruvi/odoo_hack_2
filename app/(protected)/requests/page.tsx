import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Need to create Badge or use simple styled span

async function getRequests() {
    return await prisma.maintenanceRequest.findMany({
        include: {
            equipment: true,
            assignedTechnician: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Simple Badge component inline if not exists, or I'll create it. 
// I'll use simple span for now to avoid build errors if I forget.

export default async function RequestsPage() {
    const requests = await getRequests();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Maintenance Requests</h1>
                <div className="space-x-2">
                    <Button variant="outline" asChild>
                        <Link href="/requests/calendar">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/requests/new">
                            <Plus className="mr-2 h-4 w-4" /> New Request
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {requests.map((req) => (
                    <Card key={req.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{req.subject}</CardTitle>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${req.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                        req.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                            req.status === 'REPAIRED' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-muted-foreground block">Equipment</span>
                                    {req.equipment.name}
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block">Scheduled Date</span>
                                    {new Date(req.scheduledDate).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block">Technician</span>
                                    {req.assignedTechnician?.name || 'Unassigned'}
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block">Type</span>
                                    {req.type}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No maintenance requests found.
                    </div>
                )}
            </div>
        </div>
    );
}
