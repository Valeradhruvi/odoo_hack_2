import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getEquipment(id: string) {
    return await prisma.equipment.findUnique({
        where: { id },
        include: {
            department: true,
            team: true,
            requests: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        },
    });
}

export default async function EquipmentDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params; // Next.js 15+ params are promises? Check version. Next 15 yes. User has next 14? 
    // Package.json says "next": "15.1.0" (actually typical recently). Checking package.json...
    // User's package.json said "next": "16.1.1" ?? Wait, 16? Currently Next is 14/15. 
    // Ah, looking at user's package.json in Step 11: "next": "16.1.1". That's very new (or canary/rc?). 
    // Assuming params is a promise in newer versions.

    const equipment = await getEquipment(id);

    if (!equipment) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/equipment">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{equipment.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="font-semibold">Serial Number:</div>
                                <div>{equipment.serialNumber}</div>

                                <div className="font-semibold">Location:</div>
                                <div>{equipment.location}</div>

                                <div className="font-semibold">Department:</div>
                                <div>{equipment.department?.name || 'Unassigned'}</div>

                                <div className="font-semibold">Maintenance Team:</div>
                                <div>{equipment.team?.name || 'Unassigned'}</div>

                                <div className="font-semibold">Purchase Date:</div>
                                <div>{new Date(equipment.purchaseDate).toLocaleDateString()}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button size="lg" className="w-full" asChild>
                        {/* Redirect to request creation with equipment pre-selected */}
                        <Link href={`/requests/new?equipmentId=${equipment.id}`}>
                            <Wrench className="mr-2 h-4 w-4" /> Request Maintenance
                        </Link>
                    </Button>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {equipment.requests.length > 0 ? (
                                <div className="space-y-4">
                                    {equipment.requests.map(req => (
                                        <div key={req.id} className="border-b last:border-0 pb-2 last:pb-0">
                                            <div className="font-medium">{req.subject}</div>
                                            <div className="text-xs text-muted-foreground flex justify-between">
                                                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${req.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                        req.status === 'REPAIRED' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                                                    }`}>{req.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">No maintenance history.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
