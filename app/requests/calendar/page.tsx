import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getScheduledRequests() {
    // In a real app, fetch based on month/view
    return await prisma.maintenanceRequest.findMany({
        where: {
            scheduledDate: {
                gte: new Date() // Future requests only for simplicity? Or just all.
            }
        },
        include: {
            equipment: true
        },
        orderBy: {
            scheduledDate: 'asc'
        }
    });
}

export default async function CalendarPage() {
    const requests = await getScheduledRequests();

    // Group by date simple implementation
    const grouped: Record<string, typeof requests> = {};
    requests.forEach(req => {
        const dateKey = new Date(req.scheduledDate).toLocaleDateString();
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(req);
    });

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex items-center mb-6">
                <Button variant="ghost" asChild className="mr-4">
                    <Link href="/requests">
                        <ArrowLeft className="mr-2 h-4 w-4" /> List
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Maintenance Calendar</h1>
            </div>

            <div className="space-y-8">
                {Object.entries(grouped).map(([date, reqs]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">{date}</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reqs.map(req => (
                                <div key={req.id} className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
                                    <div className="font-semibold">{req.subject}</div>
                                    <div className="text-sm text-muted-foreground">{req.equipment.name}</div>
                                    <div className="text-xs mt-2 inline-block px-2 py-1 bg-secondary rounded-full">
                                        {new Date(req.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No upcoming maintenance scheduled.
                    </div>
                )}
            </div>
        </div>
    );
}
