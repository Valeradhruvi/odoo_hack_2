import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Using Avatar, need to create or remove. 
// I removed Avatar from Navbar, so I don't have it. I should use a simple placeholder or create Avatar.
// I'll use a simple div placeholder for now to avoid build error.

async function getTeams() {
    return await prisma.maintenanceTeam.findMany({
        include: {
            technicians: true,
            equipments: true,
        },
    });
}

export default async function TeamsPage() {
    const teams = await getTeams();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Maintenance Teams</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <Card key={team.id}>
                        <CardHeader>
                            <CardTitle>{team.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold mb-2">Technicians</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {team.technicians.map((tech) => (
                                            <div key={tech.id} className="flex items-center space-x-2 bg-secondary px-2 py-1 rounded-md text-sm">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                                    {tech.name?.charAt(0) || 'U'}
                                                </div>
                                                <span>{tech.name}</span>
                                            </div>
                                        ))}
                                        {team.technicians.length === 0 && <span className="text-muted-foreground text-sm">No technicians assigned</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Assigned Equipment</h4>
                                    <p className="text-2xl font-bold">{team.equipments.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {teams.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No maintenance teams found. Seed the database?
                    </div>
                )}
            </div>
        </div>
    );
}
