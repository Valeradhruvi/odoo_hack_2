import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Users, Wrench } from "lucide-react";

async function getStats() {
    const [totalEquipment, totalRequests, totalTeams, openRequests] = await Promise.all([
        prisma.equipment.count(),
        prisma.maintenanceRequest.count(),
        prisma.maintenanceTeam.count(),
        prisma.maintenanceRequest.count({
            where: {
                status: {
                    in: ['NEW', 'IN_PROGRESS']
                }
            }
        })
    ]);

    return { totalEquipment, totalRequests, totalTeams, openRequests };
}

export default async function ReportsPage() {
    const stats = await getStats();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Maintenance Reports</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEquipment}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRequests}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.openRequests}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maintenance Teams</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTeams}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts would go here using Recharts or similar, for now just placeholders */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="h-[300px]">
                    <CardHeader>
                        <CardTitle>Requests by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Chart Implementation Pending</p>
                    </CardContent>
                </Card>
                <Card className="h-[300px]">
                    <CardHeader>
                        <CardTitle>Equipment Reliability</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Chart Implementation Pending</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
